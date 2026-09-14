import {v4 as uuidv4} from 'uuid';
import pool from "../config/db.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
 
export const getProducts= asyncHandler(async(req,res)=>{
    const {search,sort}=req.query;
    let query='SELECT * FROM products WHERE is_active = TRUE';
    const params=[];
    if(search){
        query+=' AND name LIKE ? ';
        params.push(`%${search}%`);
    }

    if(sort==='price-asc'){
        query += ' ORDER BY priceCents ASC';
    }

    if(sort==='price-desc'){
        query += ' ORDER BY priceCents DESC';
    }

    if(sort==='name-asc'){
        query += ' ORDER BY name ASC';
    }

    if(sort==='name-desc'){
        query += ' ORDER BY name DESC';
    }

    const [rows]=await pool.query(query,params);
    res.status(200).json(rows);
    
        /*const [rows]=await pool.query('SELECT * FROM products');
        res.status(200).json(rows);   
        */ 
});

export const getProducById=asyncHandler(async (req,res)=>{
   
        const {id}=req.params;
        const [rows]=await pool.query('SELECT * FROM products WHERE id=?',
            [id]
        );
        if (rows.length===0){
            const error=new Error(`No product with id of ${productId}`);
            error.status=404;
            throw error;
        }
        res.status(200).json(rows[0])
        
});

export const deleteProduct=asyncHandler(async(req,res,next)=>{
    const {id}=req.params;
    const [result]=await pool.query('UPDATE products SET is_active=FALSE WHERE id=?',
        [id]);
    if (result.affectedRows===0){
        const error=new Error('Product not found');
        error.status=404;
        throw error;
    }
    res.status(200).json({
        message:'Product Removed successfully'
    });
})

export const createProduct=asyncHandler(async(req,res,next)=>{
    const{name, brand,category, priceCents,image,stock,description}=req.body;
    //check if product exist
    const [product]=await pool.query(`SELECT id,is_active FROM products WHERE name=? AND brand=? `,
        [name,brand]);
    const keywords = [name,brand,category,description].join(" ").toLowerCase();
    
    
  
   


    if(product.length!==0){
        if(product[0].is_active){
            const error = new Error('Product already exists');
            error.status = 409; // Conflict
            throw error;

        }
         // Exists but was soft deleted
        await pool.query(`UPDATE products
        SET category = ?,priceCents = ?,image = ?,stock=?,description = ?, keywords=?,is_active = TRUE
        WHERE id = ?`,
        [category,priceCents,image,stock,description, keywords, products[0].id]);
        
         return res.status(200).json({message:'product reactivated succesfully'})
    }
    
    // Product doesn't exist -> create it
    const id=uuidv4();
    const [result]=await pool.query(`INSERT INTO PRODUCTS 
        (id,name, brand,category, priceCents,image,stock,keywords,description) 
        VALUES (?,?, ?, ?, ?,?,?,?,?)`,
        [id,name, brand,category, priceCents,image,stock,keywords,description]);
    res.status(201).json({message:'Product added successfully',product:{
        id,
        name,
        brand,
        category,
        priceCents,
        image,
        stock,
        keywords,
        description,
        is_active: true
    }})
       
        
        
});

export const editProduct=asyncHandler(async(req,res,next)=>{

    const productId=req.params.id;

    const{name, brand,category, priceCents,image,description}=req.body;

    const [result]=await pool.query(`UPDATE products SET
         name=?, brand=?,category=?, priceCents=?,image=?,description=?
       WHERE id=?`,[name, brand,category, priceCents,image,description,productId],
         );

    if(result.affectedRows===0){
        return res.status(404).json({
            message:'Product not found'
        })
    }

    return res.status(200).json({
        message:'Product updated successsfuly'
    })
        

});
