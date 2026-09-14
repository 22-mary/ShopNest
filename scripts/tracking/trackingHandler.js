import { updateCartUI } from "../utils/cartUI.js";
import { getOrders } from "../../API/ordersAPI.js";
import { renderTrackingUI } from "./trackingUI.js";
import { calculateDeliveryProgress } from "./trackingGeneralCalc.js";
export async function loadTrackingPage(){
    try {
        await updateCartUI();
        
        const url=new URL(window.location.href);

        const productId=url.searchParams.get("productId");

        const orderId=url.searchParams.get("orderId");
        
        if (!productId || !orderId) {
            console.error("Missing productId or orderId");
            return;
        }
        const orders = await getOrders();
        const order=orders.find(order=>order.id===orderId);
        if(!order){
            console.error("order not found");
            return;
        }

        const orderProduct = order.products.find(product => product.productId === productId);
        if(!orderProduct){
            console.error('product not found in the order');
            return;
        }

        const deliveryData=calculateDeliveryProgress(order);
        renderTrackingUI(order,orderProduct,deliveryData);

        
        
    } catch (error) {
        console.error("Failed to load tracking page:", error);
        
    }

}