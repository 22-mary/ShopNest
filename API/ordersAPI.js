import { initCheckoutPage } from "../scripts/checkout/checkoutPage.js";

const API_URL = "http://localhost:8000/api";

export async function placeOrderAPI(){
try {
         const response=await fetch(`${API_URL}/orders/checkout`, {
            method:'POST',
            headers:{
               'Content-Type':'application/json'
            },
            credentials:"include",
         });
         const data=await response.json();
         //check status first
         if(!response.ok){
            throw new Error(data.message||'failed to create order');

         }
         
         return data.order;

         
        } catch (error) {

         console.error(error.message);

         alert(error.message);

         return null;
         
        }
        
          
 }

 export async function getOrders(status = '', sort = 'desc') {
  try {
    const query = new URLSearchParams({ status, sort }).toString();
    const response = await fetch(`${API_URL}/orders?${query}`, {
      credentials: 'include',
       cache: 'no-store'
    });
    const orders = await response.json();
    
    return orders;

  } catch (error) {

    console.error('Error loading orders', error);

    return [];
  }
}

      

