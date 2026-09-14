import { addToCartAPI } from "../../API/cartAPI.js";
import { updateCartUI } from "./cartBadge.js";
export function attachBuyAgainListeners() {
    const orderGrid=document.querySelector('.js-orders-grid');
    if(!orderGrid)return;
    
    orderGrid.addEventListener('click',async(event)=>{
        const button=event.target.closest('.js-buy-again');
        if(!button)return;
        const productId = button.dataset.productId;
        const quantity = parseInt(button.dataset.quantity) || 1;
        try {
            await addToCartAPI(productId, quantity, '1');
            await updateCartUI();

            alert('Added to cart');
            window.location.href = "checkout.html";

        } catch (error) {
            console.error('failed to add to cart', error);
        }
    })
 
}
export function attachFilterListeners(loadOrdersPage) {
  const statusEl = document.getElementById('statusFilter');
  const sortEl = document.getElementById('sortOrder');

  if (statusEl) {
    statusEl.addEventListener('change', loadOrdersPage);
  }

  if (sortEl) {
    sortEl.addEventListener('change', loadOrdersPage);
  }
}