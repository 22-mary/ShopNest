export function renderTrackingUI(order, orderProduct, deliveryData) {
  const trackingContainer = document.querySelector('.js-order-tracking');

  if (!trackingContainer) {
    console.error('Tracking container not found');
    return;
  }

  const {
    deliveryDateString,
    deliveryPercent
  } = deliveryData;

  const trackingHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>

    <div class="delivery-date">
      ${deliveryDateString}
    </div>

    <div class="product-info">
      ${orderProduct.name}
    </div>

    <div class="product-info">
      Quantity: ${orderProduct.quantity}
    </div>

    <img class="product-image" src="${orderProduct.image}">

    <div class="progress-labels-container">
      <div class="progress-label">Preparing</div>
      <div class="progress-label">Shipped</div>
      <div class="progress-label">Delivered</div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar js-progress-bar"></div>
    </div>
  `;

  trackingContainer.innerHTML = trackingHTML;

  updateTrackingProgress(deliveryPercent);
}

function updateTrackingProgress(deliveryPercent) {
  const progressBar = document.querySelector('.js-progress-bar');

  if (progressBar) {
    progressBar.style.width = `${deliveryPercent}%`;
  }

  const labels = document.querySelectorAll('.progress-label');

  labels.forEach(label =>
    label.classList.remove('current-status')
  );

  if (deliveryPercent >= 100) {
    labels[2].classList.add('current-status'); // Delivered
  } else if (deliveryPercent >= 50) {
    labels[1].classList.add('current-status'); // Shipped
  } else {
    labels[0].classList.add('current-status'); // Preparing
  }
}