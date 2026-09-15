import { renderProductForm } from "./adminUI.js";
let editingProductId = null;

export function getEditingProductId() {
    return editingProductId;
}

export function setEditingProductId(id) {
    editingProductId = id;
}

export function clearEditingProduct() {
    editingProductId = null;
}


export function initializeNewProductButton(product){

    const button=document.querySelector('.js-add-product-btn');
    if(!button)return;

    button.addEventListener('click',()=>{
        clearEditingProduct();
        renderProductForm(product=null);
        button.classList.add('hide-button');
    });
}

export function getProductFromForm(form) {
    return {
        name: form.querySelector('.js-name').value.trim(),
        brand: form.querySelector('.js-brand').value.trim(),
        category: form.querySelector('.js-category').value.trim(),
        priceCents: Number(form.querySelector('.js-price').value),
        image: form.querySelector('.js-image').value.trim(),
        stock: Number(form.querySelector(".js-stock").value),
        description: form.querySelector('.js-description').value.trim()
    };
}

export function closeProductForm(){
    const container= document.querySelector('.js-add-product-container');
    if (!container) return;

    container.classList.remove('show');

    container.innerHTML='';

const button=document.querySelector('.js-add-product-btn');
    if(!button) return;
    button.classList.remove('hide-button');
}
