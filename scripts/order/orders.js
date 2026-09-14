import { loadOrdersPage } from "./ordersPage.js";
import { attachFilterListeners } from "./orderHandlers.js";

document.addEventListener('DOMContentLoaded', async () => {
loadOrdersPage();
attachFilterListeners(loadOrdersPage);
});