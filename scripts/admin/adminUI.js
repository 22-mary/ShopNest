export function renderProductsTable(products){
    
    let html=`
    <table class="products-table">
                    <thead class="products-head">
                        <tr>
                            <th>Name</th>
                            <th>Brand</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th colspan="2">Action</th>
                        </tr>
                    </thead>

                    <tbody>
    
    `;
    products.forEach(product=>{
        html+=renderProductRow(product)/*`
            <tr class="js-product-row">
                <td>${product.name}</td>
                <td>${product.brand}</td>
                <td>${product.category}</td>
                <td>${product.getPrice()}</td>
                <td>
                    <button class="edit-product js-edit-product"
                    data-product-id="${product.id}">Edit</button>
                </td>
                <td>
                    <button class="delete-product js-delete-product"
                    data-product-id="${product.id}">Delete</button>

                </td> 
                

            </tr>

        
        `;*/

    });
    html+=`
            </tbody>
        </table>
    
    `;
    const container=document.querySelector('.js-product-table-container')
    container.innerHTML=html;
}

export function renderProductForm(product=null){

    const isEditing = product !== null;

    const container= document.querySelector('.js-add-product-container');
    if(!container)return;

    container.innerHTML=`
        <form class="js-add-product-form">

        <div class="output-message js-form-message"></div>


            <h2>${isEditing ? "Edit Product" : "Add Product"}</h2>
            <div class="form-group">
                <label for="product-name">Product Name</label>

                <input class="js-name" type="text" name="name" placeholder="Enter product name" required value="${product?.name ?? ""}">

                <div class="form-error js-error-name"></div>
            </div>

            <div class="form-group">
                <label for="brand">Brand</label>

                <input class="js-brand" type="text" name="brand" placeholder="Enter brand name" required value="${product?.brand ?? ""}">

                <div class="form-error js-error-brand"></div>
            </div>

            <div class="form-group">
                <label for="category">Category</label>

                <input class="js-category" type="text" name="category" placeholder="Enter Category of the product" required value="${product?.category ?? ""}">

                <div class="form-error js-error-category"></div>
            </div>

            <div class="form-group">
                <label for="price">Price</label>

                <input class="js-price" type="number" name="priceCents" placeholder="Enter price in Kenyan Shillings (KSh)" required value="${product?.priceCents ?? ""}">

                <div class="form-error js-error-price"></div>
            </div>

            <div class="form-group">
                <label for="product-image">Image URL</label>

                <input class="js-image" type="text" placeholder="Image URL (e.g. https://example.com/image.jpg)" required value="${product?.image ?? ""}">

                <div class="form-error js-error-image"></div>
            </div>
            <div class="form-group">
                <label for="stock">Stock Quantity</label>
                <input type="number" class="js-stock" placeholder="Enter the stock" value="${product?.stock ?? ""}">
                <div class="form-error js-error-stock"></div>
            
            </div>

            <div class="form-group">

            <label for="description">Description</label>

            <textarea name="description" class="js-description" placeholder="Description">${product?.description ?? ""}</textarea>

            <div class="form-error js-error-description"></div>

            </div>


           <div class="form-action"> 
           <button class="save-product-button button-primary" type="submit">${isEditing ? "Update Product" : "Save Product"}</button>
           <button class="cancel-product-button js-cancel-product-button" type="button">Cancel</button>
           </div>
    
        </form>
    `;
    container.classList.add('show');
    console.log('Opening product form');
    console.log(container);
    container.classList.add('show');
    console.log(container.classList);
}

export function renderProductRow(product){
    return `<tr class="js-product-row">
                <td>${product.name}</td>
                <td>${product.brand}</td>
                <td>${product.category}</td>
                <td>${product.getPrice()}</td>
                <td>
                    <button class="edit-product js-edit-product"
                    data-product-id="${product.id}">Edit</button>
                </td>
                <td>
                    <button class="delete-product js-delete-product"
                    data-product-id="${product.id}">Delete</button>

                </td> 
                

            </tr>
            `;
}


