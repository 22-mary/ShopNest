import { formatCurrency } from "../scripts/utils/money.js";

const API_URL="http://localhost:8000/api";



function mapProduct(product){

    return{
        ...product,

        rating:{
            stars:product.ratingStars??0,
            count:product.ratingCount??0
        }

    };

}

export async function getProduct(productId){

  try {
    const response=await fetch(`${API_URL}/products/${productId}`);
    if (!response.ok) {
        throw new Error("Product not found");
    }

    const productData= await response.json();

    return new Product(mapProduct(productData))
    
  } catch (error) {
    console.error(error);
    return null;

    
  }
  
}

export class Product{
  id;
  image;
  name;
  rating;
  brand;
  category;
  stock;
  description;
  priceCents;

  constructor(productDetails){
    this.id=productDetails.id;
    this.image=productDetails.image;
    this.name=productDetails.name;
    this.brand=productDetails.brand;
    this.category=productDetails.category;
    this.stock=productDetails.stock;
    this.description=productDetails.description;
    this.rating=productDetails.rating;
    this.priceCents=productDetails.priceCents;


  }
  getStarUrl(){
    return `images/ratings/rating-${this.rating.stars*10}.png`

  }
  getPrice(){
    return `$${formatCurrency(this.priceCents)}`;
  }

  extraInfoHTML(){
    return '';
  }
}

class Clothing extends Product{
  sizeChartLink;

  constructor(productDetails){
    super(productDetails);
    this.sizeChartLink=productDetails.sizeChartLink;
  }
  extraInfoHTML(){
     return `
     <a href=${this.sizeChartLink} target="_blank">
        sizeChart
         </a>
     `;
  }

}

export async function loadProductsFetch(search='',sort=''){

  try {
    const response=await fetch(`${API_URL}/products?search=${encodeURIComponent(search)}&sort=${sort}`);
    if(!response.ok) throw new Error('Failed to fetch products');
    
    const productsData=await response.json();

    const products=productsData.map((productDetails)=>{
      // reshape backend → frontend format
      const formattedProduct = mapProduct(productDetails);

      if (formattedProduct.type === 'clothing') {
        return new Clothing(formattedProduct);
      }

      return new Product(formattedProduct);
    });

    return products;

  
    
  } catch (error) {
    console.error('unexpected error please try again later',error);
    throw error;
    
  }
}

export async function deleteProduct(productId){

  try {
    const response= await fetch(`${API_URL}/products/${productId}`,{
    method:'DELETE',
    credentials:'include',
    });
    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
      errorData.message || 'Failed to remove product'
      );
    }
    return await response.json(); 
    
  } catch (error) {
    console.error('Remove product error',error);
    return null;
    
  }

  

}

export async function createProduct(product){
  try {
    const response= await fetch(`${API_URL}/products`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      credentials:'include',
      body:JSON.stringify(product)
    });

    if(!response.ok) {
      const errorData=await response.json();
      
      throw new Error(errorData.message||'Failed to create new product')
    }
    return await response.json();
    
  } catch (error) {
    console.error(error);
    throw error;
    
  }

}

export async function editProduct(productId,product){
  try {

    const response= await fetch(`${API_URL}/products/${productId}`,{
      method:'PUT',
      headers:{
        'Content-Type':'application/json'
      },
      credentials:'include',
      body:JSON.stringify(product)
    });

    if(!response.ok) {
      const errorData=await response.json();
      
      throw new Error(errorData.message||'Failed to update product')
    }

    return await response.json();
    
    
  } catch (error) {
    console.error(error);
    throw error;
    
  }
}

  







 
