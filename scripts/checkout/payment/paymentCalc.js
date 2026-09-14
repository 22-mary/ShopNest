import { getDeliveryOption } from "../../../API/deliveryOptions.js";
export function calculatePaymentSummary(cart) {
  let cartPriceCents = 0;
  let shippingPriceCents = 0;

  cart.forEach((cartItem) => {
    cartPriceCents += cartItem.totalPrice;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  });

  const totalBeforeTaxCents = cartPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;

  return {
    cartPriceCents,
    shippingPriceCents,
    totalBeforeTaxCents,
    taxCents,
    totalCents
  };
}