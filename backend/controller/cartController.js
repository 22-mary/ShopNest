import pool from "../config/db.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
//add cart api
export const addToCart=asyncHandler(async(req,res)=>{
    
        const userId=req.user.id;
        const{productId,quantity,deliveryOptionId}=req.body;
        //check if product exist
        const [product]=await pool.query(
            'SELECT id,stock FROM products where id=?',
            [productId]);
            if(product.length===0){
                const error=new Error('product not found');
                error.status=404;
                throw error;
            }
            //Check requested quantity does not exceed stock
            if (quantity > product[0].stock) {
                const error = new Error('Quantity exceeds available stock');
                error.status = 400;
                throw error;
            }

            

        //Check if item is already in the cart

        const [existing] = await pool.query(
                `SELECT quantity FROM cart WHERE user_id=? AND product_id=?`,
                [userId, productId]
            );
            if (existing.length > 0) {
                const newQuantity = existing[0].quantity + quantity;
                if (newQuantity > product[0].stock) {
                    throw new Error('Quantity exceeds available stock');
                }
                // Update cart
                await pool.query(
                    `UPDATE cart SET quantity=?, delivery_option_id=? 
                    WHERE user_id=? AND product_id=?`,
                    [newQuantity,deliveryOptionId||'1',userId,productId]
                );

                return res.status(200).json({
                    message: "Cart updated successfully"
                });
            
            }
            //If not in cart → insert new row
            const [result] = await pool.query(
                `INSERT INTO cart(user_id, product_id, quantity, delivery_option_id)
                VALUES (?, ?, ?, ?)`,
                [userId, productId, quantity, deliveryOptionId || '1']
            );

        
        
        res.status(201).json({
            message:"Added to cart",
        });
    });

//get user cart
export const getCart=asyncHandler(async(req,res)=>{
    
        const userId=req.user.id;

        const [rows]=await pool.query(
            `SELECT cart.id,cart.product_id,cart.quantity,cart.delivery_option_id, 
                products.name,
                products.image,
                products.priceCents,
                delivery_options.deliveryDay,
                (cart.quantity*products.priceCents) AS total_cost
            FROM cart    
            JOIN products ON cart.product_id=products.id
            JOIN delivery_options ON cart.delivery_option_id=delivery_options.id
            WHERE cart.user_id=?
            `,[userId]);

           /* if(rows.length===0){
                const error=new Error('cart is empty');
                error.status=404;
                return next(error);

            }*/
            res.status(200).json(rows);
        
   
}
)

export const updateCartQuantity=asyncHandler(async(req,res)=>{

    const userId=req.user.id
    const cartId=req.params.id;
    const {quantity}=req.body;

    

    //Get current cart item and product stock
    const [cartRows] = await pool.query(
        `SELECT cart.product_id, cart.quantity AS currentQuantity, products.stock
         FROM cart
         JOIN products ON cart.product_id = products.id
         WHERE cart.id = ? AND cart.user_id = ?`,
        [cartId, req.user.id]
    );

    if (cartRows.length === 0) {
        const error = new Error('Cart item not found');
        error.status = 404;
        throw error; 
    }

    const cartItem = cartRows[0];

    // Check stock
    if (quantity > cartItem.stock) {
        const error = new Error('Quantity exceeds available stock');
        error.status = 400;
        throw error; //Throw if requested quantity > stock
    }

    //update cart quantity
    const [result]=await pool.query(`UPDATE cart
        SET quantity=?
        WHERE id=? AND user_id=?`,
        [quantity,cartId,req.user.id]);
        
    if (result.affectedRows === 0) {
      const error = new Error('Cart item not found');
      error.status = 404;
      throw error;
    }
    res.status(200).json({message:"cart Updated"});

        });

//remove from cart
export const removeFromCart=asyncHandler(async(req,res,next)=>{
    
    const cartId=req.params.id;
    const userId=req.user.id;
    const[result]=await pool.query(`DELETE from cart where 
        cart.id=? AND user_id=?`,
        [cartId,userId]);
    if (result.affectedRows === 0) {
        const error = new Error('Cart item not found');
        error.status = 404;
        throw error;
    }
    res.status(200).json({message:'Cart item removed successfully'});
    
    
    
});