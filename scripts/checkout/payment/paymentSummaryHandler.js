import { placeOrderAPI } from "../../../API/ordersAPI.js";
export function attachPlaceOrderHandler() {
  const button=document.querySelector('.js-place-order');
  if(!button)return;
  button.addEventListener('click', async () => {
      const order=await placeOrderAPI();

      if(order){
        window.location.href = 'orders.html';
      }
    });
}