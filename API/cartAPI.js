const API_URL = "http://localhost:8000/api";

//add product to cart
export async function addToCartAPI(productId, quantity, deliveryOptionId = '1') {
    const response = await fetch(`${API_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      cache: 'no-store',
      body: JSON.stringify({productId,quantity,deliveryOptionId})
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message||'Failed to add to cart');
    

    return data;
    
}
//fetch current user cart
export async function getCartAPI() {
  try {
    const response = await fetch(`${API_URL}/cart`, {
      credentials: 'include',
      cache: 'no-store' 
    });

    if (response.status === 401) {
        return [];
    }

    if (!response.ok) throw new Error('Failed to load cart');
    

    const data = await response.json();

    const cart = data.map(item => ({
      id: item.id,
      productId: item.product_id,
      quantity: item.quantity,
      name: item.name,
      image: item.image,
      priceCents: item.priceCents,
      totalPrice: item.total_cost,
      deliveryOptionId:item.delivery_option_id,
      deliveryDays: item.deliveryDays
    }));

    return cart;

  } catch (error) {
    console.error('Error loading cart:', error);
    return [];
  }
}

//get cart quantity
export function getCartQuantity(cart=[]) {
  return cart.reduce((total, item) => total + item.quantity, 0);

}

//Remove item from cart
export async function removeFromCartAPI(cartId) {
  try {
    const response= await fetch(`${API_URL}/cart/${cartId}`,{
      method:'DELETE',
      credentials:'include'
    })
    if (!response.ok) throw new Error('Failed to remove item from cart');
  
    return await response.json()
  } catch (error) {
    console.error('Remove from cart error',error);
    return null;
    
  }
  
}
// Update quantity of a cart item
export async function updateCartQuantityAPI(cartId,inputQuantity){
  if (inputQuantity <= 0) {
    throw new Error('Invalid quantity');
  }

  try {
     const response=await fetch(`${API_URL}/cart/${cartId}`,{
      method:'PUT',
      credentials:'include',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({quantity:inputQuantity})
     });
     const data=await response.json();

     if(!response.ok) throw new Error(data.message||'Failed to update cart Quantity')
     
     return data;
    
  } catch (error) {
    console.error('Update quantity error',error);
    return null;
    
  }
}


// Update delivery option for a cart item
export async function updateDeliveryOptionAPI(cartId,deliveryOptionId){

  try {
    const token = localStorage.getItem('token');
    const response=await fetch(`${API_URL}/delivery/deliveryOption`,{
      method:'PUT',
      headers:{
        'Content-Type':'application/json',
      },
      credentials:'include',
      body:JSON.stringify({cartId, deliveryOptionId})
    });
    const data=await response.json();

    if (!response.ok) throw new Error(data.message||'Failed to update delivery option');

    return data;
    
  } catch (error) {
    console.error('Error updating deliver option:',error);
    return null;
    
  }
}


/*export function trackCartProduct(productId, products = []) {
  return products.find(product => product.id === productId);
}*/




 