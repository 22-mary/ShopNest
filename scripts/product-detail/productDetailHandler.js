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
        
    }
})

}
