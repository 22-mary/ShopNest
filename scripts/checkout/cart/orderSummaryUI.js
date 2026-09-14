export function updateQuantityUI(cartId, inputQuantity) {
  const container = document.querySelector(
    `.js-cart-item-container-${cartId}`
  );
  if(!container)return;
  const label=container.querySelector('.quantity-label');
  if(label){
    label.textContent=inputQuantity;
  }
}

export function removeCartItemFromUI(cartId) {
  const element = document.querySelector(
    `.js-cart-item-container-${cartId}`
  );
  element?.remove();
}

export function updateDeliveryUI(cartId, dateString) {
  const container = document.querySelector(
    `.js-cart-item-container-${cartId}`
  );
  const deliveryDate = container.querySelector(".delivery-date");
  if (deliveryDate) {
    deliveryDate.textContent =
    `Delivery date: ${dateString}`;
  }
}