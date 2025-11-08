import {cart, removeFromCart,updateinputQuantity,updateDeliveryOption} from '../../data/cart.js';

import {products,getProduct} from '../../data/products.js';

import { formatCurrency } from '../utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

import { deliveryOptions,getDeliveryOption, calculateDeliveryDate } from '../../data/deliveryOptions.js';
import { renderPaymentSumary } from './paymentSummary.js';
import { renderCheckoutHeader } from './checkoutHeader.js';





export function renderOrderSummary(){

  let cartSummaryHTML='';

  cart.forEach((cartItem) =>{
    const productId=cartItem.productId;

    const matchingProduct=getProduct(productId);
     
  const deliveryOptionId=cartItem.deliveryOptionId;
  const deliveryOption=getDeliveryOption(deliveryOptionId);

  const dateString=calculateDeliveryDate(deliveryOption)
  
  /*const today=dayjs();

  const deliveryDate=today.add(deliveryOption.deliveryDays,'days');

  const dateString=deliveryDate.format('dddd, MMM M, D');*/

  const priceString=deliveryOption.priceCents===0
  ? 'FREE'
  :`$${formatCurrency(deliveryOption.priceCents)}-`;



    cartSummaryHTML+=`
    <div class="cart-item-container
    js-cart-item-container
    js-cart-item-container-${matchingProduct.id}">
              <div class="delivery-date">
                Delivery date: ${dateString}
              </div>

              <div class="cart-item-details-grid">
                <img class="product-image"
                  src="${matchingProduct.image}">

                <div class="cart-item-details">
                  <div class="product-name">
                    ${matchingProduct.name}
                  </div>
                  <div class="product-price">
                    $${formatCurrency(matchingProduct.priceCents)}
                  </div>
                  <div class="product-quantity 
                  js-product-quantity-${matchingProduct.id}">
                    <span>
                      Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                      Update
                    </span>
                    <input class="quantity-input js-quantity-input " data-product-id="${matchingProduct.id}">
                    <span class="link-primary save-quantity-link js-save-quantity-link" data-product-id="${matchingProduct.id}">Save</span>
                    
                    <span class="delete-quantity-link link-primary js-delete-link 
                    js-delete-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
                      Delete
                    </span>
                  </div>
                </div>

                <div class="delivery-options">
                  <div class="delivery-options-title">
                    Choose a delivery option:
                  </div>
                  
                  
                  ${deliveryOptionsHTML(matchingProduct, cartItem)}
                </div>
              </div>
            </div>
    
    `;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem){

    let html=``;


    deliveryOptions.forEach((deliveryOption)=>{
      const dateString=calculateDeliveryDate(deliveryOption);
      /*const today=dayjs();

      const deliveryDate=today.add(deliveryOption.deliveryDays,'days');

      const dateString=deliveryDate.format('dddd, MMM M, D');
      */

      const priceString=deliveryOption.priceCents===0
      ? 'FREE'
      :`$${formatCurrency(deliveryOption.priceCents)}-`;
      const isChecked= deliveryOption.id===cartItem.deliveryOptionId;

      html +=`
          <div class="delivery-option js-delivery-option"
          data-product-id="${matchingProduct.id}"
          data-delivery-option-id="${deliveryOption.id}">
          <input type="radio" ${isChecked?'checked':''}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
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
    return html;
  }

  document.querySelector('.js-order-summary').innerHTML=cartSummaryHTML;
  quantity();


  document.querySelectorAll('.js-delete-link').forEach((link) =>{
    link.addEventListener('click', ()=>{
      const productId=link.dataset.productId;
      removeFromCart(productId);
      renderOrderSummary();

     // const container=document.querySelector(`.js-cart-item-container-${productId}`);
      //container.remove();
      quantity();

      renderPaymentSumary();
      renderCheckoutHeader();
    });
  });

  function quantity(){
    let itemQuantity=0;
    cart.forEach((cartItem)=>{
      itemQuantity+=cartItem.quantity;
    });
    //document.querySelector('.js-return-to-home-link').innerHTML=`${itemQuantity} item${itemQuantity>1?'s':''}`;
  }

  document.querySelectorAll('.js-update-link').forEach((link)=>{
    link.addEventListener('click',()=>{
      const productId=link.dataset.productId;
      console.log(typeof(productId));
      const container=document.querySelector(`.js-cart-item-container-${productId}`);
      container.classList.add('is-edditing');
              
    });
    
  });

  function SavesQuantity(link){
    const productId=link.dataset.productId;
      const container=document.querySelector(`.js-cart-item-container-${productId}`);
      console.log(container);
      container.classList.remove('is-edditing');
      const inputElement=container.querySelector('.js-quantity-input');
      let inputQuantity=Number(inputElement.value);
      console.log(inputQuantity);
      updateinputQuantity(productId,inputQuantity);
      if(inputQuantity<0){
        inputQuantity=1;
        alert('Enter valid quantity!');
      }
      //const quantityLabel=container.querySelector('.quantity-label');
      //quantityLabel.textContent=inputQuantity;
      quantity();
    
  }

  document.querySelectorAll('.js-save-quantity-link').forEach((link)=>{
    link.addEventListener('click',()=>{
      SavesQuantity(link);
      renderPaymentSumary();
      renderCheckoutHeader();

    });
  });

  document.querySelectorAll('.js-quantity-input').forEach((input)=>{
    input.addEventListener('keydown',(event)=>{
    if(event.key==='Enter'){
      const productId=input.dataset.productId;
      const saveLink= document.querySelector(`.js-save-quantity-link[data-product-id="${productId}"]`);

      SavesQuantity(saveLink);

    }
  });
    
  });
  document.querySelectorAll('.js-delivery-option').forEach((element)=>{
    element.addEventListener('click', ()=>{
      const{productId,deliveryOptionId}=element.dataset;
      updateDeliveryOption(productId,deliveryOptionId);
      renderOrderSummary();
      renderPaymentSumary();
    });
  });
}
 
