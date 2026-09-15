export function renderProductUI(product){
    const productDetailContainer=document.querySelector('.js-product-details-container');

    productDetailContainer.innerHTML=
        `
        <div class="product-page">
                        <div class="product-image-section">
                            <img src="${product.image}" class="product-image-large">
                            <a href="index.html" class="back-link">
                                ← Back to Products
                            </a>
                        </div>

                        <div class="product-info-section">
                            <h1 class="product-title">
                                ${product.name}
                            </h1>

                            <p class="product-brand">
                                Brand: ${product.brand}
                            </p>

                            <p class="product-category">
                                Category: ${product.category}
                            </p>

                            <p class="product-price">
                                Price:${product.getPrice()}
                            </p>

                            <p class="product-description">
                                ${product.description}
                            </p>

                            <p class="product-rating">
                            ${product.rating.count === 0
                            ? `<p class="product-rating">☆☆☆☆☆ No reviews yet</p>`:
                            `<p class="product-rating">
                            ⭐ ${product.rating.stars} (${product.rating.count} reviews)
                            </p>`
                            }

                            <div class="product-actions">
                                <select class="js-quantity-selector">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                                <div class="added-to-cart js-added-message-${product.id}">
                                    <img src="images/icons/checkmark.png">
                                     Added
                                </div>
                                <button class="add-to-cart-button button-primary js-add-to-cart"
                                    data-product-id="${product.id}">
                                    Add to Cart
                                </button>
                                <div class="added-to-cart-message add-to-cart-error js-add-to-cart-error-${product.id}">
                                </div>

                            </div>

                        </div>
                    </div>
        `

}



