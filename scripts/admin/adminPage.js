import {loadProductsFetch} from '../../API/productsAPI.js';
import { renderProductsTable } from './adminUI.js';
import { deleteProductHandler, initializeAdminHandlers} from './adminHandler.js';
import { initializeNewProductButton } from './productForm.js';



export async function initAdminPageTable(){
    const products= await loadProductsFetch();
    renderProductsTable(products);
}
export async function initializeAdminPage() {

    initializeNewProductButton();

    deleteProductHandler();

    initializeAdminHandlers();

    await initAdminPageTable();

}
