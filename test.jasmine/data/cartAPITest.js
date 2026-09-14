import { addToCartAPI,getCartAPI,removeFromCartAPI, updateCartQuantityAPI,updateDeliveryOptionAPI } from "../../data/cartAPI.js";

//create testsuite
describe('test-suite: addToCartAPI',()=>{
    it('add product to cart',async()=>{
        spyOn(window,'fetch').and.resolveTo({
            ok:true,
            status:201,
            json:async()=>({
                message:'Added to cart'
            })
        });
        const result=await addToCartAPI('02694574-a4da-4f97-9eca-7c610a3284ec',2,'1');
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:8000/api/cart',
            {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            cache: 'no-store',
            body: JSON.stringify({productId:'02694574-a4da-4f97-9eca-7c610a3284ec',
                quantity:2,
                deliveryOptionId:'1'
            })
            }
        );
        expect(result).toEqual({message: 'Added to cart'});

    });
    it('return null when add to cart fail',async()=>{
        spyOn(window,'fetch').and.resolveTo({
            ok:false,
            status:400,
            json:async()=>({
                message:'Quantity exceeds available stock'
            })
        })
        const result=await addToCartAPI('02694574-a4da-4f97-9eca-7c610a3284ec',100,'1');
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(result).toBeNull();
    })
    it('return null when product doesnt exist',async()=>{
        spyOn(window, 'fetch').and.resolveTo({
            ok:false,
            status:404,
            json:async()=>{
                message:'Product not found'
            }
        });
        const result=await addToCartAPI('02694574-a4da-4f97--7c610a3284ec',1,'1');
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(result).toBeNull();
    })

})

describe('test suite:getCartApi',()=>{
    it('get cart and transform data correctly',async()=>{
        spyOn(window,'fetch').and.resolveTo({
            ok:true,
            json:()=>([{
                id: 5,
                product_id: '02694574-a4da-4f97-9eca-7c610a3284ec',
                quantity: 2,
                name: 'Laptop',
                image: 'laptop.jpg',
                priceCents: 50000,
                total_cost: 100000,
                delivery_option_id: '1',
                deliveryDays: 7

            }])
        })
        const cart=await getCartAPI();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/cart',
            {
            credentials: 'include',
            cache: 'no-store'
        });
        expect(cart).toEqual([{
            id: 5,
            productId: '02694574-a4da-4f97-9eca-7c610a3284ec',
            quantity: 2,
            name: 'Laptop',
            image: 'laptop.jpg',
            priceCents: 50000,
            totalPrice: 100000,
            deliveryOptionId: '1',
            deliveryDays: 7
        }]);
    });

    it('return empty array when get cart fails',async()=>{
        spyOn(window, 'fetch').and.resolveTo({
            ok:false,
            status:500,
            json:async()=>({
                message:'Internal Server Error'
            })
        });
        const cart=await getCartAPI();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:8000/api/cart',
            {
            credentials: 'include',
            cache: 'no-store'
            }
        );
        expect(cart).toEqual([]);
    });

});

describe('test suite:removeFromCartAPI',()=>{
    it('removes item from cart',async()=>{
        spyOn(window,'fetch').and.resolveTo({
            ok:true,
            status:200,
            json:async()=>({
                message:'Cart item removed successfully'
            })
        });
        const result=await removeFromCartAPI('02694574-a4da-4f97-9eca-7c610a3284ec');
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:8000/api/cart/02694574-a4da-4f97-9eca-7c610a3284ec',
            {
                method:'DELETE',
            credentials: 'include'
            }
        );
        expect(result).toEqual({
            message:'Cart item removed successfully'
        })

    })
    
    it('returns null when remove from cart fail',async()=>{
        spyOn(window,'fetch').and.resolveTo({
            ok:false,
            status:404,
            json:async()=>({
                message:'Cart iten not found'
            })
        });
        const result = await removeFromCartAPI('invalid-cart-id');
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(result).toBeNull();
    });
})

describe('test suite: updateCartQuantityAPI',()=>{
    it('updates cart quantity',async()=>{
        spyOn(window,'fetch').and.resolveTo({
            ok:true,
            status:200,
            json:async()=>({
                message:'Cart updated'
            })

        })
        const result=await updateCartQuantityAPI('cart-2',1);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/cart/cart-2',
            {
                method:'PUT',
                credentials: 'include',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({quantity:1})
            })
        expect(result).toEqual({
            message:'Cart updated'
        });

    })
    it('returns null when cart is not found',async()=>{
        spyOn(window,'fetch').and.resolveTo({
            ok:false,
            status:404,
            json:async()=>({
                message:'cart item not found'
            })
        });
        const result=await updateCartQuantityAPI('invalid-cart',3);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(result).toBeNull();

    });
    it('returns null when quantity exceeds stock', async () => {

        spyOn(window, 'fetch').and.resolveTo({
            ok: false,
            status: 400,
            json: async () => ({
            message: 'Quantity exceeds available stock'
            })
        });

        const result = await updateCartQuantityAPI(
            'cart-item-123',
            100
        );

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(result).toBeNull();

    });
    it('throws an error when quantity is 0 or less', async()=>{
        spyOn(window,'fetch');
        await expectAsync(updateCartQuantityAPI('cart-item-123', 0)
            ).toBeRejectedWithError('Invalid quantity');
        expect(fetch).not.toHaveBeenCalled();
    });
        
});

describe('test suite:updateDeliveryOptionAPI',()=>{
    it('updates delivery option successfuly',async()=>{
        spyOn(window,'fetch').and.resolveTo({
            ok:true,
            status:200,
            json:async()=>({
                message:'Delivery option updated successfully'
            })
        });
        const result=await updateDeliveryOptionAPI('cart-item-123','2');
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/delivery/deliveryOption',
            {
                method:'PUT',
                credentials: 'include',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({cartId:'cart-item-123',deliveryOptionId:'2'})
            }
        );
        expect(result).toEqual({message:'Delivery option updated successfully'})
    });

    it('return null if cart not found',async()=>{
        spyOn(window,'fetch').and.resolveTo({
            ok:false,
            status:404,
            json:async()=>({
                message:'Cart item not found'
            })
        });
        const result=await updateDeliveryOptionAPI('invalid-cart','3');
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(result).toBeNull()
    })
})