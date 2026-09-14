import { getOrders } from "../../API/ordersAPI.js";
import { renderOrder } from "./orderUI.js";
import { attachBuyAgainListeners,attachFilterListeners } from "./orderHandlers.js";
import { updateCartUI } from "../utils/cartUI.js";
import { showLoadingSpinner,hideLoadingSpinner } from "../utils/loadingUI.js";

export async function loadOrdersPage() {
  const spinner = document.querySelector('.js-loading-spinner');
  try {
    //show spinner
   showLoadingSpinner('loading Orders....')

    // Read filter values
    
    const status = document.getElementById('statusFilter')?.value || '';
    const sort = document.getElementById('sortOrder')?.value || 'desc';

    const orders = await getOrders(status, sort);

    await renderOrder(orders);
    
    await updateCartUI();

    attachBuyAgainListeners();
    

  } catch (error) {
    console.error("Failed to load orders page:", error);
  }finally {
    //  HIDE spinner
    hideLoadingSpinner();
  }

  
}



