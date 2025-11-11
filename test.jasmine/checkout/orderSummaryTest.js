import { renderOrderSummary } from "../../scripts/checkout/orderSummary.js";
import {  loadFromStorage, cart } from "../../data/cart.js";
import { renderPaymentSumary } from "../../scripts/checkout/paymentSummary.js";
describe('test suite: render OrderSummary',()=>{
  const productId1= "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
  const productId2= "15b6fc6f-327a-4ec4-896f-486349e85a3d";
  const deliveryOptionId1='1';
  const deliveryOptionId2='2';
  const deliveryOptionId3='3';
  afterEach(()=>{
    document.querySelector('.js-test-container').innerHTML='' ;
  })
  beforeEach(()=>{
    spyOn(localStorage, 'setItem');
  document.querySelector('.js-test-container').innerHTML=`<div class="js-order-summary"></div>
  <div class="js-payment-summary"></div>
  <div class="js-checkout-header"></div>
  <div class="js-checkout-header"></div>
  <div class="js-delivery-option"></div>
  
  
  ` ;

  
  spyOn(localStorage, 'getItem').and.callFake(()=>{
    return JSON.stringify([{
    productId:productId1,
    quantity:2,
    deliveryOptionId:deliveryOptionId1
  },{
    productId:productId2,
    quantity:1,
    deliveryOptionId:deliveryOptionId2
  }]);
    }); 
    console.log(localStorage.getItem('cart'));
    loadFromStorage();
    renderOrderSummary();
    renderPaymentSumary();

     
  })
  it('displays the cart',() => {
    expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(2);
    expect(document.querySelector(`.js-product-quantity-${productId1}`).innerText).toContain('Quantity: 2'); 
    expect(document.querySelector(`.js-product-quantity-${productId2}`).innerText).toContain('Quantity: 1');
    expect(document.querySelector(`.js-product-price-${productId2}`).textContent.trim()).toEqual('$20.95');
    expect(
      document.querySelector(`.js-product-name-${productId2}`).textContent.trim()).toEqual('Intermediate Size Basketball');
      expect(
      document.querySelector(`.js-product-name-${productId1}`).textContent.trim()).toEqual("Black and Gray Athletic Cotton Socks - 6 Pairs");
  
});
it('removes a product',()=>{
  
    document.querySelector(`.js-delete-link-${productId1}`).click();
    expect(
      document.querySelectorAll('.js-cart-item-container').length).toEqual(1);
      expect(
        document.querySelector(`.js-cart-item-container-${productId1}`)).toEqual(null);
        expect(
        document.querySelector(`.js-cart-item-container-${productId2}`)).not.toEqual(null);
        expect(cart.length).toEqual(1);
        expect(cart[0].productId).toEqual(productId2);
        
});
it('updating delivery option', ()=>{
  document.querySelector(`.js-delivery-option-${productId1}-${deliveryOptionId3}`).click()
   const inputElement=document.querySelector(`.js-delivery-option-input-${productId1}-${deliveryOptionId3}`)
   const value=Number(inputElement.value);
   expect(inputElement.checked).toBeTrue();
   expect(cart.length).toEqual(2);
   expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
   expect(cart[0].deliveryOptionId).toEqual('3');
   expect(document.querySelector('.js-shipping-price').textContent.trim()).toEqual('$14.98');
    expect(document.querySelector('.js-total-price').textContent.trim()).toEqual('$63.50');
})
});   