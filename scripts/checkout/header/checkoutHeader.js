import {getCartQuantity } from "../../../API/cartAPI.js";
import { renderCheckoutHeaderHTML } from "./checkoutHeaderUI.js";
export async function renderCheckoutHeader(cart){

  const itemQuantity=getCartQuantity(cart);

  const headerHTML=renderCheckoutHeaderHTML(itemQuantity);
  
  document.querySelector('.js-checkout-header').innerHTML=headerHTML;




}