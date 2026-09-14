import { createOrder } from "../../controller/orderController.js";
import pool from "../../config/db.js";

describe('createOrder', () => {

    let connection;
    let req;
    let res;
    let json;
    let next;

    beforeEach(()=>{
        

        connection={
            beginTransaction:jasmine.createSpy('beginTransaction'),
            query:jasmine.createSpy('query'),
            commit:jasmine.createSpy('commit'),
            rollback:jasmine.createSpy('rollback'),
            release:jasmine.createSpy('release'),
           
        }
        connection.query.and.returnValues(
            // 1. Get cart
            [
                [
                    {
                        product_id: 1,
                        quantity: 1,
                        priceCents: 1000,
                        stock: 10,
                        deliveryDays: 3,
                        total_cost: 1000
                    }
                ]
            ],

            // 2. Insert order
            [],

            // 3. Insert order item
            [],

            // 4. Update stock
            [],

            // 5. Get order details
            [
                [
                    {
                        orderId: 'order1',
                        total: 1000,
                        status: 'pending',
                        order_time: '2026-08-25',
                        estimated_delivery_time: '2026-08-28',
                        product_id: 1,
                        quantity: 1,
                        price: 1000,
                        productName: 'product-1'
                    }
                ]
            ],

            // 6. Delete cart
            []
        );


        spyOn(pool,'getConnection').and.resolveTo(connection);
        req={
            user:{
                id:'user1'
            }
        }
        json=jasmine.createSpy('json')
        res={
            status:jasmine.createSpy('status').and.returnValue({
                json
            })
        }

        next = jasmine.createSpy('next');
        
    })
    it('creates an order successfully', async () => {

        await createOrder(req, res);

        expect(connection.beginTransaction).toHaveBeenCalled();
        expect(connection.commit).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(json).toHaveBeenCalled();

    });

    it('calculates the correct total for multiple cart items', async () => {

        connection.query.and.returnValues(
            // 1. Get cart
            [
                [
                    {
                        product_id: 1,
                        quantity: 2,
                        priceCents: 1000,
                        stock: 10,
                        deliveryDays: 3,
                        total_cost: 2000
                    },
                    {
                        product_id: 2,
                        quantity: 3,
                        priceCents: 500,
                        stock: 10,
                        deliveryDays: 3,
                        total_cost: 1500
                    }
                ]
            ],

            // 2. Insert order
            [],

            // 3. Insert order item 1
            [],

            // 4. Update stock 1
            [],

            // 5. Insert order item 2
            [],

            // 6. Update stock 2
            [],

            // 7. Get order details
            [
                [
                    {
                        orderId: 'order1',
                        total: 3500,
                        status: 'pending',
                        order_time: '2026-08-25',
                        estimated_delivery_time: '2026-08-28',
                        product_id: 1,
                        quantity: 2,
                        price: 1000,
                        productName: 'product-1'
                    },
                    {
                        orderId: 'order1',
                        total: 3500,
                        status: 'pending',
                        order_time: '2026-08-25',
                        estimated_delivery_time: '2026-08-28',
                        product_id: 2,
                        quantity: 3,
                        price: 500,
                        productName: 'product-2'
                    }
                ]
            ],

            // 8. Delete cart
            []
        );

        await createOrder(req, res, next);

        expect(connection.query).toHaveBeenCalledWith(
            jasmine.stringMatching(/INSERT INTO orders/),
            [
                jasmine.any(String),
                'user1',
                3500,
                'pending',
                jasmine.anything()
            ]
        );
    });

    it('creates an order item for each cart item', async () => {

        connection.query.and.returnValues(
            // 1. Get cart
            [
                [
                    {
                        product_id: 1,
                        quantity: 2,
                        priceCents: 1000,
                        stock: 10,
                        deliveryDays: 3,
                        total_cost: 2000
                    },
                    {
                        product_id: 2,
                        quantity: 3,
                        priceCents: 500,
                        stock: 10,
                        deliveryDays: 3,
                        total_cost: 1500
                    }
                ]
            ],

            // 2. Insert order
            [],

            // 3. Insert order item 1
            [],

            // 4. Update stock 1
            [],

            // 5. Insert order item 2
            [],

            // 6. Update stock 2
            [],

            // 7. Get order details
            [
                [
                    {
                        orderId: 'order1',
                        total: 3500,
                        status: 'pending',
                        order_time: '2026-08-25',
                        estimated_delivery_time: '2026-08-28',
                        product_id: 1,
                        quantity: 2,
                        price: 1000,
                        productName: 'product-1'
                    },
                    {
                        orderId: 'order1',
                        total: 3500,
                        status: 'pending',
                        order_time: '2026-08-25',
                        estimated_delivery_time: '2026-08-28',
                        product_id: 2,
                        quantity: 3,
                        price: 500,
                        productName: 'product-2'
                    }
                ]
            ],

            // 8. Delete cart
            []
        );

        await createOrder(req, res, next);

        expect(connection.query).toHaveBeenCalledWith(
            jasmine.stringMatching(/INSERT INTO order_items/),
            [
                jasmine.any(String),
                1,
                2,
                1000
            ]
        );

        expect(connection.query).toHaveBeenCalledWith(
            jasmine.stringMatching(/INSERT INTO order_items/),
            [
                jasmine.any(String),
                2,
                3,
                500
            ]
        );
    });

    it('deducts the correct quantity from each product stock', async () => {

        connection.query.and.returnValues(
            // 1. Get cart
            [
                [
                    {
                        product_id: 1,
                        quantity: 2,
                        priceCents: 1000,
                        stock: 10,
                        deliveryDays: 3,
                        total_cost: 2000
                    },
                    {
                        product_id: 2,
                        quantity: 3,
                        priceCents: 500,
                        stock: 10,
                        deliveryDays: 3,
                        total_cost: 1500
                    }
                ]
            ],

            // 2. Insert order
            [],

            // 3. Insert order item 1
            [],

            // 4. Update stock 1
            [],

            // 5. Insert order item 2
            [],

            // 6. Update stock 2
            [],

            // 7. Get order details
            [
                [
                    {
                        orderId: 'order1',
                        total: 3500,
                        status: 'pending',
                        order_time: '2026-08-25',
                        estimated_delivery_time: '2026-08-28',
                        product_id: 1,
                        quantity: 2,
                        price: 1000,
                        productName: 'product-1'
                    },
                    {
                        orderId: 'order1',
                        total: 3500,
                        status: 'pending',
                        order_time: '2026-08-25',
                        estimated_delivery_time: '2026-08-28',
                        product_id: 2,
                        quantity: 3,
                        price: 500,
                        productName: 'product-2'
                    }
                ]
            ],

            // 8. Delete cart
            []
        );

        await createOrder(req, res, next);

        expect(connection.query).toHaveBeenCalledWith(
            jasmine.stringMatching(/UPDATE products/),
            [2, 1]
        );

        expect(connection.query).toHaveBeenCalledWith(
            jasmine.stringMatching(/UPDATE products/),
            [3, 2]
        );
    });

    it('creates an error when the cat is empty',async ()=>{
        connection.query.and.returnValue([]);

        await createOrder(req, res, next);
        expect(connection.rollback).toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });
    it('handles insufficient stock', async () => {

        connection.query.and.returnValue([
            [
                {
                    product_id: 1,
                    quantity: 5,
                    priceCents: 1000,
                    stock: 2,
                    deliveryDays: 3,
                    total_cost: 5000
                }
            ]
        ]);

        await createOrder(req, res, next);

        expect(connection.rollback).toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    })

    it('rolls back when a database error occurs', async () => {

        connection.query.and.callFake(() => {
            throw new Error('database error');
        });

        await createOrder(req, res, next);

        expect(connection.rollback).toHaveBeenCalled();
        expect(next).toHaveBeenCalled();

    });
    it('updates product stock after creating an order', async () => {

        await createOrder(req, res, next);

        expect(connection.query).toHaveBeenCalledWith(
            jasmine.stringMatching(/UPDATE products/),
            [1, 1]
        );

    });

    it('clears the cart after creating an order', async () => {

        await createOrder(req, res, next);

        expect(connection.query).toHaveBeenCalledWith(
            jasmine.stringMatching(/DELETE FROM cart/),
            ['user1']
        );

    });

    it('returns the created order in the response', async () => {

        await createOrder(req, res, next);

        expect(json).toHaveBeenCalledWith(
            jasmine.objectContaining({
                message: "Order placed successfully",
                order: jasmine.any(Object)
            })
        );

    });
    it('releases the database connection', async () => {

        await createOrder(req, res, next);

        expect(connection.release).toHaveBeenCalled();

    });

    it('releases the database connection when an error occurs', async () => {

        connection.query.and.callFake(() => {
            throw new Error('database error');
        });

        await createOrder(req, res, next);

        expect(connection.release).toHaveBeenCalled();

    });
    
})
