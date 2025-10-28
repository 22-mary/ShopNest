export function renderCheckoutHeaderHTML(itemQuantity) {
  return `
    Checkout (<a class="return-to-home-link" href="amazon.html">${itemQuantity} item${itemQuantity !== 1 ? 's' : ''}</a>)
  `;
}