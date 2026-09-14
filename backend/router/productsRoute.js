import express from 'express';
import { getProducts, getProducById,deleteProduct,createProduct,editProduct } from '../controller/productsController.js';
import { validate } from '../middleware/validate.js';
import { validateToken } from '../middleware/createTokens.js';
import { productSchema } from '../validator/productValidator.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router=express.Router();

router.get('/',getProducts);
router.get('/:id',getProducById);
router.delete('/:id',validateToken,isAdmin,deleteProduct);
router.post('/',validateToken,isAdmin,validate(productSchema),createProduct);
router.put('/:id',validateToken,isAdmin,validate(productSchema),editProduct);



export default router;