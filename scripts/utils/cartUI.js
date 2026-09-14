import { getCartAPI,getCartQuantity} from "../../API/cartAPI.js";
export async function updateCartUI() {

    const cart = await getCartAPI();

    const cartQuantityElement = document.querySelector('.js-cart-quantity');

    if (!cartQuantityElement) return;

    const cartQuantity=getCartQuantity(cart);

    cartQuantityElement.innerHTML = cartQuantity;
}

  