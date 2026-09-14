import express from 'express';
import {v4 as uuidv4} from 'uuid';
import pool from '../config/db.js';
import { calculateDeliveryDays } from '../utils/deliveryTime.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const createOrder=asyncHandler(async(req,res)=>{
    const connection=await pool.getConnection();
    try {
        await connection.beginTransaction();
        const userId=req.user.id;
        //get cartitems
        const[cartItems]=await connection.query(
            `SELECT
                    cart.product_id,
                    cart.quantity,
                    products.priceCents,
                    products.stock,
                    delivery_options.deliveryDay AS deliveryDays,

                    (cart.quantity*products.priceCents) AS total_cost
            FROM cart
            JOIN products ON cart.product_id=products.id
            JOIN delivery_options ON cart.delivery_option_id=delivery_options.id
            WHERE cart.user_id=?
            `,[userId]);
        if(cartItems.length===0){
            const error=new Error('cart is empty');
            error.status=400;
            throw error;
        }

        // Check stock for each item
        for (const item of cartItems) {
            if (item.quantity > item.stock) {
                const error = new Error(`Product ID ${item.product_id} exceeds available stock`);
                error.status = 400;
                throw error;
            }
        }

        //insert into order
        const total=cartItems.reduce((sum,item)=>sum+item.total_cost,0);
        const days=cartItems[0].deliveryDays;
        const estimatedDeliveryTime=calculateDeliveryDays(days);
        

        const orderId=uuidv4();
        const [orderResult]=await connection.query(`INSERT INTO orders (id,user_id,total,status,estimated_delivery_time)
            VALUES(?,?,?,?,?)`,[orderId,userId,total,'pending',estimatedDeliveryTime]);

        
        //insert into orderItem
        for(const item of cartItems){
            const[orderItemResult]=await connection.query(
                `INSERT INTO order_items(
                order_id,product_id,quantity,price)
                VALUES(?,?,?,?)
           `,[orderId,item.product_id,item.quantity,item.priceCents])

           // Deduct stock
            await connection.query(
                `UPDATE products
                 SET stock = stock - ?
                 WHERE id = ?`,
                [item.quantity, item.product_id]
            );
            
        } 
        const[orderDetails]=await connection.query(`SELECT 
            orders.id as orderId,orders.total,orders.status,orders.order_time, orders.estimated_delivery_time,
            order_items.product_id,order_items.quantity,
            order_items.price,
            products.name AS productName
            FROM orders
            JOIN order_items ON orders.id=order_items.order_id
            JOIN products ON order_items.product_id=products.id
            WHERE orders.id=?
            `,[orderId]);
            const order={
                id:orderDetails[0].orderId,
                total:orderDetails[0].total,
                status:orderDetails[0].status,
                orderTime:orderDetails[0].order_time,
                deliveryTime:orderDetails[0].estimated_delivery_time,
                items:orderDetails.map(item=>({
                    productId:item.product_id,
                    name:item.productName,
                    price:item.price,
                    quantity:item.quantity


                }))
            }
        
        //clear cart
        await connection.query(`DELETE FROM cart
            WHERE user_id=?`,[userId]);
        await connection.commit();
        res.status(201).json({
            message:"Order placed successfully",
            order

        })

        

        
    } catch (error) {
        await connection.rollback();
        throw error;
        
    }finally{
        connection.release();
    }
    

});

export const getOrders=asyncHandler(async(req,res)=>{

        const userId=req.user.id;
        // Auto-update overdue pending orders
        await pool.query(`
            UPDATE orders
            SET status = 'completed'
            WHERE estimated_delivery_time <= NOW()
            AND status = 'pending'
        `);

        const { status, sort } = req.query;

        let query = `
        SELECT 
            orders.id as orderId,
            orders.total,
            orders.status,
            orders.order_time,
            orders.estimated_delivery_time,
            order_items.product_id,
            order_items.quantity,
            order_items.price,
            products.name AS productName,
            products.image AS productImage
        FROM orders
        JOIN order_items ON orders.id = order_items.order_id
        JOIN products ON order_items.product_id = products.id
        WHERE orders.user_id = ?`;

        const params = [userId];

        // Apply status filter
        if (status) {
            query += ` AND orders.status = ?`;
            params.push(status);
        }
        // Apply sorting
        if (sort === 'asc') query += ` ORDER BY orders.order_time ASC`;
        else if (sort === 'desc') query += ` ORDER BY orders.order_time DESC`;
        else query += ` ORDER BY orders.order_time DESC`; // default newest first

        const [rows] = await pool.query(query, params);


       /* const[rows]=await pool.query(`SELECT 
            orders.id as orderId,orders.total,orders.status,orders.order_time,orders.estimated_delivery_time,
            order_items.product_id,order_items.quantity,
            order_items.price,
            products.image As productImage,
            products.name AS productName
            FROM orders
            JOIN order_items ON orders.id=order_items.order_id
            JOIN products ON order_items.product_id=products.id
            WHERE orders.user_id=?
            ORDER BY orders.order_time ASC
            `,[userId]);*/

            //group by orderId
            const orderMap={};
            rows.forEach(row=>{
                if(!orderMap[row.orderId]){
                    orderMap[row.orderId]={
                        id:row.orderId,
                        totalCostCents:row.total,
                        status:row.status,
                        orderTime:row.order_time,
                        estimatedDeliveryTime:row.estimated_delivery_time,
                        products:[]

                    }
                }
                orderMap[row.orderId].products.push({
                    productId:row.product_id,
                    name:row.productName,
                    image:row.productImage,
                    quantity:row.quantity,
                    price:row.price
                })
            })
            const order=Object.values(orderMap);

        
        res.status(200).json(order);   
});

export const getOrderById=asyncHandler(async(req,res)=>{
    
        const userId=req.user.id;
        const orderId=req.params.id;
        const [order]=await pool.query('SELECT * FROM orders WHERE id=? AND user_id=?',[orderId,userId]);

        if(order.length===0){
            const error=new Error(`order with id of ${orderId} not found`);
            error.status=404;
            throw error;
        }
        const [items]=await pool.query(`
            SELECT 
                order_items.product_id,
                products.name,
                order_items.price,
                order_items.quantity
                FROM order_items
                JOIN products ON order_items.product_id=products.id
                WHERE order_items.order_id=?`,[orderId])
        res.status(200).json({order:order[0],
            items:items
        });
    
})


