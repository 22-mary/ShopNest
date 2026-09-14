import pool from "../../config/db.js";
import { addToCart, updateCartQuantity,removeFromCart,getCart} from "../../controller/cartController.js";

describe('test suite:addToCart',()=>{
    
    let req;
    let res;
    let json;
    let next;

    beforeEach(()=>{
        req={
            user:{
                id:'user1'

            },
            body:{
                productId:'product 1',
                quantity:5,
                deliveryOptionId:'1'
            }
        }

        json=jasmine.createSpy('json')

        res={
            json: json,
            status:jasmine.createSpy('status').and.returnValue({
                json
            })
        };
        next=jasmine.createSpy('next');

        spyOn(pool, 'query');
    });

    it('adds a new product to cart sucessfully', async()=>{
        pool.query.and.returnValues(
            //1. product exist and has enough stock
            Promise.resolve([[{

                id:'product 1',
                stock:10

            } ]]),
            //2. product isnt in the cart
            Promise.resolve([[]]),

            //3.cart insert succeed

            Promise.resolve([
                { insertId: 1 }
            ])
        );

        await addToCart(req,res,next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(json).toHaveBeenCalledWith(
            jasmine.objectContaining({
                message:'Added to cart'
            })
        )
        

    });
    it('returns an error when the product does not exist', async () => {
        pool.query.and.resolveTo([[]]);

        await addToCart(req,res,next);
        expect(next).toHaveBeenCalledWith(
            jasmine.objectContaining({
                message:'product not found',
                status:404
            })
        );
        expect(res.json).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it('returns an error when quantity exceeds stock', async () => {
        pool.query.and.resolveTo([[
            {
                productId:'product 1',
                stock:3
            }
        ]]);
        await addToCart(req,res,next);

        expect(next).toHaveBeenCalledWith(
            jasmine.objectContaining({
                message:'Quantity exceeds available stock',
                status:400
            })
        );
        expect(res.json).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it('updates an existing cart item successfully', async () => {

        pool.query.and.returnValues(
            //1. product exist and has enough stock
            Promise.resolve([[{

                id:'product 1',
                stock:10

            } ]]),
            //2. product is in the cart
            Promise.resolve([[
                {
                quantity:2
                }
            ]]),

            // 3. UPDATE succeeds
            Promise.resolve([
                { affectedRows: 1 }
            ])
        );

        await addToCart(req,res,next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            jasmine.objectContaining({
                message:'Cart updated successfully'
            })
        )

    });

    it('returns error when quantity of product already in cart exceeds stock after updating quantity of the product', async()=>{
         req.body.quantity = 4;
        pool.query.and.returnValues(
        //1. product exist 
            Promise.resolve([[{

                id:'product 1',
                stock:5

            } ]]),
            //2. product is in the cart
            Promise.resolve([[
                {
                quantity:2
                }
            ]])
        );

        await addToCart(req,res,next);
        expect(next).toHaveBeenCalledWith(
            jasmine.objectContaining({
                message:'Quantity exceeds available stock'
            })
        );
    });

});

describe('test suite: updateCartQuantity',()=>{
    let req;
    let res;
    let json;
    let next;

    beforeEach(()=>{
        req={
            user:{
                id:'user1'

            },
            body:{
                
                quantity:5,
                
            },
            params:{

                id:'cart 1'

            }
        }

        json=jasmine.createSpy('json')

        res={
            json: json,
            status:jasmine.createSpy('status').and.returnValue({
                json
            })
        };
        next=jasmine.createSpy('next');

        spyOn(pool, 'query');
    });


    it('succesfuly updates the cart quantity', async()=>{
        
        
        pool.query.and.returnValues(
             // 1. Cart item exists + stock is enough
            Promise.resolve([[
            {   cartId:'cart 1',
                productId:'product 1',
                quantity:1,
                stock:10
            }
            ]]),
            // 2. UPDATE succeeds
            Promise.resolve([[
                {
                    affectedRows:1
                }
            ]])
        );
        
        
        await updateCartQuantity(req,res,next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            jasmine.objectContaining({
                message:'cart Updated'

            }
                
            )
        )


    });
    it('returns error when cartitem is not found', async()=>{
        pool.query.and.resolveTo([[]]);

        await updateCartQuantity(req,res,next);

        expect(next).toHaveBeenCalledWith(
            jasmine.objectContaining({
                message:'Cart item not found',
                status:404
            })
        );
        expect(res.json).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it('return error when quantity exceeds stock', async()=>{
        req.body.quantity=6;
        pool.query.and.resolveTo([[
            {
                
                stock:5
            }
        ]]);

        await updateCartQuantity(req,res,next);

        expect(next).toHaveBeenCalledWith(
            jasmine.objectContaining({
                message:'Quantity exceeds available stock',
                status:400
            })
        );
    });
});

describe('test suite:removeFromCart',()=>{

    let req;
    let res;
    let json;
    let next;

    beforeEach(()=>{
        req={
            user:{
                id:'user1'

            },
           
            params:{

                id:'cart 1'

            }
        }

        json=jasmine.createSpy('json')

        res={
            json: json,
            status:jasmine.createSpy('status').and.returnValue({
                json
            })
        };
        next=jasmine.createSpy('next');

        spyOn(pool, 'query');
    });


    it('succesfully remove item from cart', async()=>{
        pool.query.and.resolveTo([
            { affectedRows: 1 }
        ]);

        await removeFromCart(req,res,next);
        expect(res.status).toHaveBeenCalledWith(200);

        expect(json).toHaveBeenCalledWith({
            message: 'Cart item removed successfully'
        });

    });

    it('returns error when cart Item is not found', async()=>{
        pool.query.and.resolveTo([
             { affectedRows: 0 }
        ]);

        await removeFromCart(req,res,next);

        expect(next).toHaveBeenCalledWith(
            jasmine.objectContaining({
                message:'Cart item not found',
                status:404
            })
        );
        expect(res.json).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();

    });

});

describe('test suite:getCart',()=>{
    let req;
    let res;
    let json;
    let next;

    beforeEach(()=>{
        req={
            user:{
                id:'user1'

            },
           
        }

        json=jasmine.createSpy('json')

        res={
            json: json,
            status:jasmine.createSpy('status').and.returnValue({
                json
            })
        };
        next=jasmine.createSpy('next');

        spyOn(pool, 'query');
    });

    it('returns users cart successfully', async()=>{
        pool.query.and.resolveTo([[
            {
                id: 1,
                product_id: 'product 1',
                quantity: 1,
                delivery_option_id: 1,
                name: 'Product One',
                image: 'image.jpg',
                priceCents: 1000,
                deliveryDay: 7,
                total_cost: 1000
            }
        ]]);
         
        await getCart(req,res,next);

        expect(res.status).toHaveBeenCalledWith(200);
       
        expect(json).toHaveBeenCalled();

    });
});