import { deleteProduct,createProduct,getProduct,editProduct } from "../../API/productsAPI.js";
import { renderProductForm} from "./adminUI.js";
import { validateProduct } from "./validate.js";
import { showMessage } from "./message.js";
import { getProductFromForm,closeProductForm, clearEditingProduct,getEditingProductId,setEditingProductId } from "./productForm.js";
import { initAdminPageTable } from "./adminPage.js";

export function initializeAdminHandlers(){
    const container=document.querySelector('.js-add-product-container');
    const button=document.querySelector('.js-add-product-btn');
    const tableContainer=document.querySelector('.js-product-table-container');

    if(!container||!button||!tableContainer)return;

    container.addEventListener('submit', handleProductSubmit);
    
    container.addEventListener('click',(event)=>{
        if (event.target.closest('.js-cancel-product-button')){
            closeProductForm();
        }
    });

    tableContainer.addEventListener('click',async(event)=>{
        const editButton=event.target.closest('.js-edit-product')

        if (!editButton ) return;

        

        const productId = editButton.dataset.productId;

        button.classList.add('hide-button');

        await editProductHandler(productId);

    })
}


export function deleteProductHandler(){
    const container=document.querySelector('.js-product-table-container');

    if(!container)return;
    container.addEventListener('click',async (event)=>{

        const deleteButton=event.target.closest('.js-delete-product');
        if(!deleteButton)return;

        const confirmed = confirm(
        'Are you sure you want to delete this product?'
        );

        if (!confirmed) return;


        const productId=deleteButton.dataset.productId;

        try {
            const result=await deleteProduct(productId);

            const pageMessage = document.querySelector(".js-add-product-message");

            await initAdminPageTable();
            showMessage(
                pageMessage,
                "success",
                result.message,
                3000
            );

            pageMessage.scrollIntoView({
                behavior:'smooth',
                block:'nearest'
            });


        } catch (error) {
            showMessage(pageMessage,"error",result.message,3000);
            pageMessage.scrollIntoView({
                behavior:'smooth',
                block:'nearest'
            });
           console.error('failed to remove product',error); 
        }

    })
}




let messageTimeOut;
async function handleProductSubmit(event){
    const form=event.target.closest('.js-add-product-form');
    if(!form)return;

    event.preventDefault();

    const product=getProductFromForm(form);
    const hasErrors=validateProduct(product,form);
    if(hasErrors)return;

    clearTimeout(messageTimeOut);
    const submitButton = form.querySelector('button[type="submit"]');

    submitButton.disabled = true;
    submitButton.textContent = "Saving...";

    let response;
    const isEditing = getEditingProductId() !== null;

    try {
        if(isEditing){

            response= await editProduct(getEditingProductId(),product);

            clearEditingProduct();

        }else{
         response=await createProduct(product);
        }
        const pageMessage = document.querySelector(".js-add-product-message");
        await initAdminPageTable();
        closeProductForm();
        showMessage(pageMessage,"success",response.message,3000);
        pageMessage.scrollIntoView({
            behavior:'smooth',
            block:'nearest'
        });
    } catch (error) {

        const formMessage = form.querySelector(".js-form-message");
        
        showMessage(formMessage,"error",error.message,5000);
        formMessage.scrollIntoView({
            behavior:'smooth',
            block:'nearest'
        });
        
    }finally{
        if(form.isConnected){

            submitButton.disabled = false;
            submitButton.textContent = isEditing ? "Update Product":"Save Product";

        }
    }
    
}
    
export async function editProductHandler(productId){
    const product=await getProduct(productId);
    if(!product) return;
    setEditingProductId(productId);
    renderProductForm(product);


}




