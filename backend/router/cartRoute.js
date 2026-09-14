import { addToCart,removeFromCart,getCart,updateCartQuantity } from "../controller/cartController.js";
import express from 'express';
import { validateToken } from "../middleware/createTokens.js";
import { validate } from "../middleware/validate.js";
import { cartSchema,updateCartSchema,updateDeliveryOptionSchema } from "../validator/cartvalidator.js";

const router=express.Router();
router.post('/',validateToken,validate(cartSchema),addToCart);
router.get('/',validateToken, getCart);
router.delete('/:id',validateToken,removeFromCart);
router.put('/:id',validateToken,validate(updateCartSchema),updateCartQuantity)

export default router;
//