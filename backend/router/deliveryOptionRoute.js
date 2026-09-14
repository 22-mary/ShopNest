import { updateDeliveryOption } from "../controller/deliveryOptionController.js";
import express from 'express';
import { validateToken } from "../middleware/createTokens.js";
import { updateDeliveryOptionSchema } from "../validator/cartvalidator.js";
import { validate } from "../middleware/validate.js";

const router=express.Router();

//router.put('/deliveryOption',validateToken,updateDeliveryOption);
router.put('/deliveryOption',validateToken,validate(updateDeliveryOptionSchema), updateDeliveryOption);

export default router;