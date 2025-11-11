import { addToCart,cart,loadFromStorage,removeFromCart,updateDeliveryOption } from "../../data/cart.js";
  
 
describe('test suite: addToCart',()=>{
  beforeEach(()=>{
    spyOn(localStorage, 'setItem'); 
  })
  it('adds an existing product to the cart',()=>{
    

    

    spyOn(localStorage, 'getItem').and.callFake(()=>{
      return JSON.stringify([{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 1,
        deliveryOptionId: '1'
      }]);
    });
    console.log(localStorage.getItem('cart'));
    loadFromStorage();
    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6'); 
    expect(cart[0].quantity).toEqual(2);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 2,
        deliveryOptionId: '1'}]));

    

  });
  it('add a new product to cart',()=>{
    
    spyOn(localStorage, 'getItem').and.callFake(()=>{
      return JSON.stringify([]);
    });
    console.log(localStorage.getItem('cart'));
    loadFromStorage();

     
    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6'); 
    expect(cart[0].quantity).toEqual(1);

    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 1,
        deliveryOptionId: '1'}]));

  });

});
describe('test suite: Removes from cart', ()=>{


  const productId1= "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
  const productId2= "15b6fc6f-327a-4ec4-896f-486349e85a3d";


  beforeEach(()=>{
  spyOn(localStorage, 'setItem');
  spyOn(localStorage, 'getItem').and.callFake(()=>{
    return JSON.stringify([{
    productId:productId1,
    quantity:2,
    deliveryOptionId:'1'
  },{
    productId:productId2,
    quantity:1,
    deliveryOptionId:'2'
  }]);
});
loadFromStorage()
  });
  it('removes product that is in cart',()=>{
    removeFromCart(productId1);
    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });
  it('removes product that is not in the cart',()=>{
    expect(cart.length).toEqual(2);

  })
});

describe('test suite: updatingDeliveryOption',()=>{
  const productId1= "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
  const productId2= "15b6fc6f-327a-4ec4-896f-486349e85a3d";
 
beforeEach(()=>{
  spyOn(localStorage, 'setItem');
  spyOn(localStorage, 'getItem').and.callFake(()=>{
    return JSON.stringify([{
    productId:productId1,
    quantity:2,
    deliveryOptionId:'1'
  },{
    productId:productId2,
    quantity:1,
    deliveryOptionId:'2'
  }]);
});
loadFromStorage();

  });
   

  it('update delivery option of a product in the cart',()=>{
    

    updateDeliveryOption(productId1,'3');
    ;
    expect(cart[0].deliveryOptionId).toEqual('3');
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });
  it('does nothing for updating product not in the cart',()=>{
    const originalCart = JSON.stringify(cart); 
    const productId3="fghnfj-ghdgahda";
    updateDeliveryOption(productId3,'3');
    expect(JSON.stringify(cart)).toEqual(originalCart);
    expect(localStorage.setItem).not.toHaveBeenCalled();

  });

});
