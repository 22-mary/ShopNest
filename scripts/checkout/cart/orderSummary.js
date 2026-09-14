import { formatCurrency } from '../../utils/money.js';
import { deliveryOptions,getDeliveryOption, calculateDeliveryDate } from '../../../API/deliveryOptions.js';
import { handleDelete,handleUpdateQuantity,handleDeliveryChange } from './orderSummaryHandler.js';





  function renderEmptyCart(container){
    container.innerHTML = `
    <div class="empty-cart-container">
      
      <img src="images/empty-cart.png" class="empty-cart-image">

      <h2>Your cart is empty</h2>
      <p>Looks like you haven’t added anything yet.</p>

      <p class="empty-cart-subtext">
        Shop today’s deals or discover new products.
      </p>

      <a href="index.html">
        <button class="button-primary">Continue Shopping</button>
      </a>

    </div>
    `;


  }
export async function renderOrderSummary(cart){

  const orderSummaryContainer = document.querySelector('.js-order-summary');
 
  if (!orderSummaryContainer) return;
    

  if (!cart || cart.length === 0) {
    renderEmptyCart(orderSummaryContainer)
    return;
  }
  
  

  let cartSummaryHTML='';

  for (const cartItem of cart) {

    
     
  const deliveryOptionId=cartItem.deliveryOptionId;
  const deliveryOption=getDeliveryOption(deliveryOptionId);

  const dateString=calculateDeliveryDate(deliveryOption);

  const priceString=deliveryOption.priceCents===0
  ? 'FREE'
  :`$${formatCurrency(deliveryOption.priceCents)}-`;



    cartSummaryHTML+=`
    <div class="cart-item-container
    js-cart-item-container
    js-cart-item-container-${cartItem.id}">
              <div class="delivery-date">
                Delivery date: ${dateString}
              </div>

              <div class="cart-item-details-grid">
                <img class="product-image"
                  src="${cartItem.image}">

                <div class="cart-item-details">
                  <div class="product-name js-product-name-${cartItem.id}">
                    ${cartItem.name}
                  </div>
                  <div class="product-price js-product-price-${cartItem.id}">
                    $${formatCurrency(cartItem.priceCents)}
                  </div>
                  <div class="product-quantity 
                  js-product-quantity-${cartItem.id}">
                    <span>
                      Quantity: <span class="quantity-label js-quantity-label">${cartItem.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary js-update-link" data-cart-id="${cartItem.id}">
                      Update
                    </span>
                    <input class="quantity-input js-quantity-input " data-cart-id="${cartItem.id}">
                    <span class="link-primary save-quantity-link js-save-quantity-link" data-cart-id="${cartItem.id}">Save</span>
                    
                    <span class="delete-quantity-link link-primary js-delete-link 
                    js-delete-link-${cartItem.id}" data-cart-id="${cartItem.id}">
                      Delete
                    </span>
                  </div>
                </div>

                <div class="delivery-options">
                  <div class="delivery-options-title">
                    Choose a delivery option:
                  </div>
                  
                  
                  ${deliveryOptionsHTML( cartItem)}
                </div>
              </div>
            </div>
    
    `;
  };

  

  

orderSummaryContainer.innerHTML = cartSummaryHTML;

}
function deliveryOptionsHTML(cartItem){

    let deliveryOptionHTML=``;


    deliveryOptions.forEach((deliveryOption)=>{
      const dateString=calculateDeliveryDate(deliveryOption);

      const priceString=deliveryOption.priceCents===0
      ? 'FREE'
      :`$${formatCurrency(deliveryOption.priceCents)}-`;
      const isChecked= deliveryOption.id===cartItem.deliveryOptionId;

      deliveryOptionHTML +=`
          <div class="delivery-option js-delivery-option js-delivery-option-${cartItem.id}-${deliveryOption.id}"
          data-cart-id="${cartItem.id}"
          data-delivery-option-id="${deliveryOption.id}">
          <input type="radio" ${isChecked?'checked':''}
            class="delivery-option-input js-delivery-option-input-${cartItem.id}-${deliveryOption.id}"
            name="delivery-option-${cartItem.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>
      `
      
    });
    return deliveryOptionHTML;
  }
document.addEventListener('DOMContentLoaded', () => {

  const orderSummaryContainer=document.querySelector('.js-order-summary');
  if(!orderSummaryContainer)return;
  orderSummaryContainer.addEventListener('click',async(event)=>{
    const saveLink=event.target.closest('.js-save-quantity-link');
    const deleteLink=event.target.closest('.js-delete-link');
    const updateLink=event.target.closest('.js-update-link');
    const deliveryOption=event.target.closest('.js-delivery-option');

    //delete item
    if(deleteLink){
      const cartId=deleteLink.dataset.cartId;
      await handleDelete(cartId);
    }
    //save item
    if(saveLink){
      const cartId=saveLink.dataset.cartId;
      const container = document.querySelector(
        `.js-cart-item-container-${cartId}`
      );
      if(!container)return;

      const inputElement = container.querySelector('.js-quantity-input');
      if(!inputElement)return;

      container.classList.remove('is-editing');

      await handleUpdateQuantity(cartId, inputElement, saveLink);
    }
    //update mode
    if(updateLink){
      const cartId=updateLink.dataset.cartId;
      const container=document.querySelector(`.js-cart-item-container-${cartId}`);
      if(!container) return;
      container.classList.add('is-editing');


    }
    //deliveryOption
    if(deliveryOption){
      const{cartId,deliveryOptionId}=deliveryOption.dataset;
      await handleDeliveryChange(cartId,deliveryOptionId)

    }



  }) 
}) 

