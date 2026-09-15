export function renderProductsGridUI(products,searchTerm=''){  
  if (!products || products.length === 0) {
    document.querySelector('.js-product-grid').innerHTML = `
      <div class="no-results">
        <h2>No products found for "${searchTerm}"</h2>
        <p>Try a different keyword.</p>

        <button class="show-all-products js-show-all-products">
          Show All Products
        </button>
      </div>
    `;
    return;
  }

  let productsHTML='';
  products.forEach((product)=>{
    productsHTML+=`
    <div class="product-container js-product-card" data-product-id="${product.id}">

        <a href="product-detail.html?productId=${product.id}" class="product-link">
          <div class="product-image-container js-product-image-container">
            <img src="${product.image}" class="product-image">
          </div>
        </a>

        <a href="productDetail.html?productId=${product.id}" class="product-link">
          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>
        </a>


       
        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="${product.getStarUrl()}">
          <div class="product-rating-count link-primary">
            ${product.rating.count} reviews
          </div>
        </div>
      

        <div class="product-price">
          ${product.getPrice()}
        </div>
      

        
        
       

        

        <div class="product-quantity-container">
          <select class="js-quantity-selector-${product.id}">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        ${product.extraInfoHTML()}


        <div class="product-spacer"></div>

        <div class="added-to-cart-message added-to-cart js-added-message-${product.id}">
          <img src="images/icons/checkmark.png">
          Added
        </div>
        <div class="added-to-cart-message add-to-cart-error js-add-to-cart-error-${product.id}">
          
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
          Add to Cart
        </button>
      </div> 
      `
        ;
        
    

  });
  document.querySelector('.js-product-grid').innerHTML=productsHTML;

}