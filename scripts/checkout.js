import { renderOrderSummary } from "./checkout/orderSummary.js";
import { loadProducts } from "../data/products.js";

import { renderPaymentSumary } from "./checkout/paymentSummary.js";
import { renderCheckoutHeader } from "./checkout/checkoutHeader.js";
//import '../data/cart-class.js'
import '../data/car.js';
//import '../data/backend-practice.js'
import { loadCart } from "../data/cart.js";
Promise.all([
  new Promise((resolve)=>{
  loadProducts(()=>{
    resolve('value1');
  });
  }),
  new Promise((resolve)=>{
      loadCart(()=>{
        resolve();
      });
    })
]).then(()=>{
  renderCheckoutHeader();
  renderOrderSummary();
  renderPaymentSumary();
})

/*new Promise((resolve)=>{
  loadProducts(()=>{
    resolve('value1');});
  }).then((value)=>{
    console.log(value);
    return new Promise((resolve)=>{
      loadCart(()=>{
        resolve();
      })
    })
  }).then(()=>{
    renderOrderSummary;
    renderPaymentSumary;
    renderCheckoutHeader;
  })



new Promise((resolve)=>{
  loadProducts(()=>{
    resolve();
  });
}).then(()=>{
    renderOrderSummary();
    renderPaymentSumary();
    renderCheckoutHeader();
    
  });
/*loadProducts(()=>{
  renderOrderSummary();
  renderPaymentSumary();
  renderCheckoutHeader();

})*/
