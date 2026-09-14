import {readFile} from 'fs/promises';
import pool from './config/db.js';
import console from 'console';

async function importProducts() {
        const data=await readFile(new URL('./data/products.json', import.meta.url));
        const products=JSON.parse(data);

    for(const product of products){
        await pool.query(`INSERT INTO  products(
            id,name,image,priceCents,ratingStars,ratingCount,keywords)
            VALUES(?,?,?,?,?,?,?)`,[
                product.id,
                product.name,
                product.image,
                product.priceCents,
                product.rating.stars,
                product.rating.count,
                JSON.stringify(product.keywords)
            ])
    }
    console.log("products imported succesfully");
    process.exit();
    
}
importProducts();