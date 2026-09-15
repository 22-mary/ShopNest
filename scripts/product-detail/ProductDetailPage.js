import { getProduct } from "../../API/productsAPI.js";
import { renderProductUI } from "./productDetailUI.js";
import { addToCartHandler } from "./productDetailHandler.js";

export async function initProducDetailtPage(){
    const url=new URL(window.location.href);
    const productId=url.searchParams.get("productId");

    const product=await getProduct(productId);
    if (!product) {
        document.querySelector(".js-product-details-container").innerHTML = `
            <h2>Product not found.</h2>
            <a href="index.html">Return to products</a>
        `;
        return;
    }
    renderProductUI(product);
    addToCartHandler();


}
