

function getErrorElements(form) {
    return {
        name: form.querySelector(".js-error-name"),
        brand: form.querySelector(".js-error-brand"),
        category: form.querySelector(".js-error-category"),
        price: form.querySelector(".js-error-price"),
        image: form.querySelector(".js-error-image"),
        stock: form.querySelector(".js-error-stock"),
        description: form.querySelector(".js-error-description")
    };
}

export function clearErrors(errors) {
    errors.name.textContent = "";
    errors.brand.textContent = "";
    errors.category.textContent = "";
    errors.price.textContent = "";
    errors.image.textContent = "";
    errors.stock.textContent = "";
    errors.description.textContent = "";
}

export function validateProduct(product,form){

    const errors=getErrorElements(form)
    clearErrors(errors);

    let hasErrors=false;

    if(!product.name){
        errors.name.textContent='Name is required';
        hasErrors=true
    }

    if(!product.brand){
        errors.brand.textContent='Brand is required';
        hasErrors=true;
    }
    if(!product.category){
        errors.category.textContent='Category is required';
        hasErrors=true;
    }
    if(product.priceCents === "" || Number.isNaN(product.priceCents)){
        errors.price.textContent='Price is required';
        hasErrors=true;
    }else{
        if(product.priceCents <= 0){
            errors.price.textContent='Price must be greater than 0';
            hasErrors=true;
        }
    }
    if(!product.image){
        errors.image.textContent='Image URL is required';
        hasErrors=true
    } 
    if(product.image){
        const isHttpUrl = /^https?:\/\/.+/i.test(product.image);
        const isLocalImage = product.image.startsWith("images/");

        if(!isHttpUrl && !isLocalImage){
            errors.image.textContent = "Enter a valid image URL or local image path";
            hasErrors = true;
            
        }
        
    }

    if(Number.isNaN(product.stock)){
        errors.stock.textContent='stock is required';
        hasErrors=true;
    }else{
        if(product.stock <= 0){
            errors.stock.textContent='Stock must be greater than 0';
            hasErrors=true;
        }
    }

    if(!product.description){
        errors.description.textContent='Description is required';
        hasErrors=true;
    } 
    return hasErrors;

}