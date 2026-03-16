import { loadCart,getCartQuantity } from "../data/cart.js";
import { renderAmazonCartHeader } from "./amazonHeaderView.js";
/*export function renderAmazonCartHead(){

  const cart=await loadCart()
  const itemQuantity=getCartQuantity();
  const headerHTML=renderAmazonCartHeader(itemQuantity)
  document.querySelector('.js-cart-quantity').innerHTML=headerHTML;
}
  */
export async function renderAmazonCartHead(){

  const cart = await loadCart();

  const itemQuantity = getCartQuantity(cart);

  document.querySelector('.js-cart-quantity').innerHTML = itemQuantity;
}