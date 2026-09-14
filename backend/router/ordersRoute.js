import express from 'express';
import { createOrder,getOrders,getOrderById } from '../controller/orderController.js';
import { validateToken } from '../middleware/createTokens.js';

//initialize router
const router= express.Router();

//routes
router.post('/checkout',validateToken,createOrder);
router.get('/',validateToken,getOrders);
router.get('/:id',validateToken,getOrderById);


export default router;