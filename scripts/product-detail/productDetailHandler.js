import { addToCartAPI } from "../../API/cartAPI.js";
import { showAddedMessage } from "../product/productHandler.js";
export function addToCartHandler(){
    const container = document.querySelector(
        '.js-product-details-container'
    );
    if(!container) return;
    container.addEventListener('click',async (event)=>{
    const button=event.target.closest('.js-add-to-cart');

    if(!button) return;

    const productId=button.dataset.productId;
    
    const quantitySelector=document.querySelector('.js-quantity-selector');
    const quantity=Number(quantitySelector.value);

    try {
        const result=await addToCartAPI(productId,quantity, '1');
        if(!result){
            throw new Error('Failed to add to cart!');

        }
        
        showAddedMessage(productId);
            

    } catch (error) {
        console.error('Add to cart failed',error);

        if (error.message === 'Please log in to continue.') {
            const errorMessage = document.querySelector(
                `.js-add-to-cart-error-${productId}`
            );

            if (errorMessage) {
                errorMessage.textContent =
                    'Please log in first to add this product to your cart.';

                errorMessage.classList.add('visible');
            }
            const redirectUrl = `product-detail.html?productId=${productId}`;


            setTimeout(() => {
                window.location.href =
                    `login.html?redirect=${encodeURIComponent(redirectUrl)}`;
            }, 2000);
            return;
        }
        
    }
})

}
