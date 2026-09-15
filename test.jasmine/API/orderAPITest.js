import { placeOrderAPI } from "../../API/ordersAPI.js";

describe('test suite:placeOrderAPI',()=>{
    it('creates order successfully',async()=>{
        spyOn(window,'fetch').and.resolveTo({
        ok:true,
        json:()=>({
            message:"order placed successfully",
            order:{
                id:"order1",
                total:1000,
                status:"pending",
                orderTime:"2026-08-25",
                deliveryTime:"2026-08-28",
                items:[{
                    productId:1,
                    name:"product-1",
                    price:1000,
                    quantity:1


             } ]
            }
        })
        })

        const result=await placeOrderAPI();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/orders/checkout', {
            method:'POST',
            headers:{
               'Content-Type':'application/json'
            },
            credentials:"include"}
        );
        expect(result).toEqual({
            id:"order1",
                total:1000,
                status:"pending",
                orderTime:"2026-08-25",
                deliveryTime:"2026-08-28",
                items:[{
                    productId:1,
                    name:"product-1",
                    price:1000,
                    quantity:1


             } ]

        })
       

    });
    it('returns null when create order fails', async()=>{
        spyOn(window,'fetch').and.resolveTo({
            ok:false,
            status:500,
            json:async()=>({
                message:'Internal server error'
            })
        })
        spyOn(window, 'alert');

        const result=await placeOrderAPI();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(result).toBeNull();
    })
   
 })

