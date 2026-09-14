import { renderOrderSummary } from './cart/orderSummary.js';
import { renderPaymentSummary } from './payment/paymentSummary.js';
import { renderCheckoutHeader } from './header/checkoutHeader.js';
import { getCartAPI } from '../../API/cartAPI.js';
import { updateCartUI } from '../utils/cartUI.js';
import { showLoadingSpinner, hideLoadingSpinner } from '../utils/loadingUI.js';

export async function initCheckoutPage() {
  try {
    showLoadingSpinner('Loading checkout...');

    const cart = await getCartAPI();

    await updateCartUI();

    await renderOrderSummary(cart);
    await renderPaymentSummary(cart);
    await renderCheckoutHeader(cart);

  } catch (error) {
    console.error('Error loading checkout page:', error);
  } finally {
    hideLoadingSpinner();
  }
}



/*export async function placeOrder(){
  const cart= await getCartAPI()
  await renderOrderSummary(cart);
  await renderPaymentSummary(cart);
  await renderCheckoutHeader(cart);
}
  */
