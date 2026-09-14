import { formatCurrency } from "../utils/money.js";
export async function renderOrder(orders){

  const grid = document.querySelector('.js-orders-grid');
  if (!grid) return;


  let orderHTML="";

 if (!orders || orders.length === 0) {
  grid.innerHTML = `
    <div class="empty-orders">
      <img src="images/empty-cart.png" class="empty-orders-image">

      <h2>No orders yet</h2>
      <p>You haven’t placed any orders. Start shopping now!</p>

      <a href="index.html">
        <button class="shop-now-btn">Shop Now</button>
      </a>
    </div>
  `;
  return;
}

 orders.forEach((order)=>{
    const orderDate=new Date(order.orderTime);
    const orderDateString=orderDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    const totalDollars= formatCurrency(order.totalCostCents);
    //console.log(order.totalCostCents);

    const rawDate = order.estimatedDeliveryTime;
    let deliveryDateString = 'TBD';
    if(rawDate){
    const deliveryDate=new Date(rawDate)
    deliveryDateString = deliveryDate.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric' 
        });
      }

    let orderSummaryHTML=`

        <div class="order-container">
            
            <div class="order-header">
              <div class="order-header-left-section">
                <div class="order-date">
                  <div class="order-header-label">Order Placed:</div>
                  <div>${orderDateString}</div>
                </div>
                <div class="order-total">
                  <div class="order-header-label">Total:</div>
                  <div>$${totalDollars}</div>
                </div>
              </div>

              <div class="order-header-right-section">
                <div class="order-header-label">Order ID:</div>
                <div>${order.id}</div>
              </div>
            </div>

            <div class="order-details-grid">
            `;
    

        
            order.products.forEach((product)=>{

            orderSummaryHTML+=`
            <div class="product-image-container">
              <img src="${product.image}">
            </div>

            <div class="product-details">
              <div class="product-name">
                ${product.name}
              </div>
              <div class="product-delivery-date">
                Arriving on: ${deliveryDateString}
              </div>
              <div class="product-quantity">
                Quantity: ${product.quantity}
              </div>
              <button class="buy-again-button button-primary js-buy-again" 
              data-product-id=${product.productId} 
              data-quantity=${product.quantity}>
                <img class="buy-again-icon" src="images/icons/buy-again.png">
                <span class="buy-again-message">Buy it again</span>
              </button>
            </div>

            <div class="product-actions">
              <a href="tracking.html?orderId=${order.id}&productId=${product.productId}">
                <button class="track-package-button button-secondary js-track-package-button">
                  Track package
                </button>
              </a>
            </div>
            `;
            
          });
            orderSummaryHTML += `</div></div>`;
            orderHTML+=orderSummaryHTML

        }) ;
                
        
    grid.innerHTML=orderHTML;
          
}