import { cart,getCartQuantity } from "../../data/cart.js";
import { renderCheckoutHeaderHTML } from "./checkoutHeaderView.js";
export function renderCheckoutHeader(){

  const itemQuantity=getCartQuantity();
  const headerHTML=renderCheckoutHeaderHTML(itemQuantity);
  document.querySelector('.js-checkout-header').innerHTML=headerHTML;




}