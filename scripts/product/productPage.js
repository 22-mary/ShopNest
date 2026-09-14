import { loadProductsFetch } from "../../API/productsAPI.js";
import { renderProductsGridUI } from "./productUI.js";
import { attachAddToCartListeners, handleSearchProduct } from "./productHandler.js";
import { showLoadingSpinner,hideLoadingSpinner } from "../utils/loadingUI.js";
export async function initProductPage() {
  try {
    showLoadingSpinner('Loading products.....')
    const products = await loadProductsFetch();

    renderProductsGridUI(products);

    attachAddToCartListeners();
    
    handleSearchProduct();


  } catch (error) {

    console.error('Error initializing product page:', error);

    document.querySelector('.js-product-grid').innerHTML = `
      <div class="no-results">
        <h2>Oops! Something went wrong.</h2>
        <p>We couldn't load the products. Please try again later.</p>
      </div>
    `;

  }finally{

    hideLoadingSpinner();
  }
}