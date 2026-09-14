import { addToCartAPI} from "../../API/cartAPI.js";
import { loadProductsFetch } from "../../API/productsAPI.js";
import { renderProductsGridUI } from "./productUI.js";
import { initializeHeader } from "../header/header.js";
export function attachAddToCartListeners() {
  document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', async () => {
      const productId = button.dataset.productId;

      const quantitySelector = document.querySelector(
        `.js-quantity-selector-${productId}`
      );

      const quantity = Number(quantitySelector.value);
      button.disabled = true;
      button.textContent = 'Adding...';

      try {
        const result = await addToCartAPI(productId, quantity, '1');

        button.textContent = 'Added ✓';

        initializeHeader();

        quantitySelector.value = '1';

        showAddedMessage(productId);

        

      } catch (error) {
        console.error('Add to cart failed:', error);

        button.textContent = 'Add to Cart';

        showErrorMessage(productId,error.message);

      }finally{

        button.disabled=false;

        button.textContent='Add to Cart';
      }
    });
  });
}
let addedMessageTimeout;

export function showAddedMessage(productId) {

  const message = document.querySelector(`.js-added-message-${productId}`);

  if (!message) return;

  clearTimeout(addedMessageTimeout);  

  message.classList.add('visible');

  addedMessageTimeout=setTimeout(() => {
    message.classList.remove('visible');
  }, 2000);
}

let errorMessageTimeout;

export function showErrorMessage(productId,error){
  const message=document.querySelector(`.js-add-to-cart-error-${productId}`);

  if(!message)return;

  clearTimeout(errorMessageTimeout);

  message.textContent=error;

  message.classList.add('visible');

  errorMessageTimeout=setTimeout(()=>{

    message.classList.remove('visible');
  }, 2000)
}

async function showAllProducts(searchInput, sortSelect) {
  searchInput.value = '';

  sortSelect.value = '';

  const products = await loadProductsFetch();

  renderProductsGridUI(products);

  attachAddToCartListeners();
}

async function performSearch(searchInput,sortSelect) {

  const sortValue=sortSelect.value;

  const searchTerm=searchInput.value.trim();

  const products= await loadProductsFetch(searchTerm,sortValue);

  renderProductsGridUI(products,searchTerm);

  attachAddToCartListeners();
  
}
export function handleSearchProduct(){

  const searchButton=document.querySelector('.js-search-button');

  const searchInput=document.querySelector('.js-search-bar');

  const sortSelect=document.querySelector('.js-sort-products');

  searchButton.addEventListener('click',()=>{
    performSearch(searchInput,sortSelect);
  })

  sortSelect.addEventListener('change',()=>{
    performSearch(searchInput,sortSelect);
  })

  searchInput.addEventListener('keydown',(event)=>{
    if (event.key === 'Enter') {

      performSearch(searchInput,sortSelect);
    
    }
  }) 
  document.addEventListener('click', (event) => {
    if (event.target.closest('.js-show-all-products')) {
      showAllProducts(searchInput, sortSelect);
    }
  });

}
