import { getCartAPI,getCartQuantity } from "../../API/cartAPI.js";
export async function updateCartUI() {
  const cart = await getCartAPI();

  const cartQuantity=document.querySelector('.js-cart-quantity');
  if(!cartQuantity)return;
  
  cartQuantity.innerHTML =getCartQuantity(cart);
}