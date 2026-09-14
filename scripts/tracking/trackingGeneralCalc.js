export function calculateDeliveryProgress(order) {
  const deliveryDate = new Date(order.estimatedDeliveryTime);
  const orderDate = new Date(order.orderTime);
  const now = new Date();

  const deliveryDateString = deliveryDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const totalDuration = deliveryDate - orderDate;
  const timePassed = now - orderDate;

  let deliveryPercent = (timePassed / totalDuration) * 100;

  // Keep percentage between 0 and 100
  deliveryPercent = Math.min(Math.max(deliveryPercent, 0), 100);

  return {
    deliveryDate,
    orderDate,
    deliveryDateString,
    deliveryPercent
  };
}