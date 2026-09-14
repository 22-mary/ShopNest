import { renderPaymentSummaryUI } from "./paymentSummaryUI.js";
import {calculatePaymentSummary} from './paymentCalc.js'
import { renderEmptyPaymentSummary } from "./paymentSummaryUI.js";
import { getCartQuantity,getCartAPI } from "../../../API/cartAPI.js";
import {attachPlaceOrderHandler} from "./paymentSummaryHandler.js";
export async function renderPaymentSummary(cart) {
  
  const cartQuantity = getCartQuantity(cart);

  if (cartQuantity === 0) {
    renderEmptyPaymentSummary();
    return;
  }

  const summary = calculatePaymentSummary(cart);

   renderPaymentSummaryUI(summary, cart);

  attachPlaceOrderHandler();

}