import { removeCartItemFromUI,updateQuantityUI,updateDeliveryUI } from "./orderSummaryUI.js";
import { getCartAPI, removeFromCartAPI,updateCartQuantityAPI,updateDeliveryOptionAPI } from "../../../API/cartAPI.js";
import { getDeliveryOption,calculateDeliveryDate } from "../../../API/deliveryOptions.js";
import {renderOrderSummary} from "./orderSummary.js";
import { renderCheckoutHeader } from "../header/checkoutHeader.js";
import { renderPaymentSummary } from "../payment/paymentSummary.js";

export async function handleDelete(cartId){
  try {
    //API update
    await removeFromCartAPI(cartId);
    //UI update
    await removeCartItemFromUI(cartId);
    //Get the updated cart once
    const cart=await getCartAPI();
    //update totals
    await renderOrderSummary(cart);
    await renderCheckoutHeader(cart);
    await renderPaymentSummary(cart);
    
  } catch (error) {

    console.error(error)
    
  }
    
}
let isUpdating=false;

export async function handleUpdateQuantity(cartId,inputElement,saveLink){
  if (isUpdating) return;
  isUpdating = true;

  // Save previous quantity in case we need to roll back
  const previousQuantity = Number(
    document.querySelector(
      `.js-cart-item-container-${cartId} .quantity-label`
    ).textContent
  );

  let quantity = Number(inputElement.value);


  if (isNaN(quantity) || quantity < 1) {
    quantity = 1;
    alert('Enter valid quantity!');
  }

  // optimistic UI
  updateQuantityUI(cartId, quantity);

  // loading state
  saveLink.textContent = "Saving...";
  saveLink.style.pointerEvents = "none";

  try {
    await updateCartQuantityAPI(cartId, quantity);
    //Get the updated cart once
    const cart=await getCartAPI();
     // update totals
    await renderPaymentSummary(cart);
    await renderCheckoutHeader(cart);
  } catch (error) {
    // Roll back UI
    updateQuantityUI(cartId, previousQuantity);

    console.error(error);

    alert('Failed to update quantity');
    isUpdating = false;
   
  }finally{
    // restore button
    saveLink.textContent = "Save";
    saveLink.style.pointerEvents = "auto";

    isUpdating = false;
    
  }

}
  
export async function handleDeliveryChange(cartId, deliveryOptionId){
  try {

    //update API
    await updateDeliveryOptionAPI(cartId,deliveryOptionId);
    //calculate newDate
    const deliveryOption=getDeliveryOption(deliveryOptionId);
    const dateString=calculateDeliveryDate(deliveryOption);
    //ui update
    updateDeliveryUI(cartId,dateString);

    //Get the updated cart once
    const cart=await getCartAPI();

    //update totals
    await renderPaymentSummary(cart);
    
  } catch (error) {
    console.error(error);
  }
    

}