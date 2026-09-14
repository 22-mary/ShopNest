export function renderCheckoutHeaderHTML(itemQuantity) {
  return `
    Checkout (<a class="return-to-home-link js-return-to-home-link" href="index.html">${itemQuantity} item${itemQuantity > 1 ? 's' : ''}</a>)
  `;
}