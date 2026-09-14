import { formatCurrency } from "../../utils/money.js";
import { getCartQuantity } from "../../../API/cartAPI.js";
export function renderPaymentSummaryUI(summary, cart) {
  const itemQuantity=getCartQuantity(cart);

  const container = document.querySelector('.js-payment-summary');
  if(!container)return;

  container.innerHTML = `
  <div class="payment-summary-title">
      Order Summary
      </div>

      <div class="payment-summary-row">
      <div class="js-cart-quantity-payment">Item${itemQuantity > 1 ? 's' : ''} (${itemQuantity}):</div>
      <div class="payment-summary-money">
      $${formatCurrency(summary.cartPriceCents)}
      </div>
      </div>

      <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money js-shipping-price">
      $${formatCurrency(summary.shippingPriceCents)}
      </div>
      </div>

      <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">
      $${formatCurrency(summary.totalBeforeTaxCents)}
      </div>
      </div>

      <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">
      $${formatCurrency(summary.taxCents)}
      </div>
      </div>

      <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money js-total-price">
      $${formatCurrency(summary.totalCents)}
      </div>
      </div>

      <button class="place-order-button button-primary 
      js-place-order">
      Place your order
      </button>
    
  `;
  
}

export async function renderEmptyPaymentSummary(){

        const container=document.querySelector('.js-payment-summary');

        container.innerHTML='';
        container.style.display = 'none';

        

}

