import express from 'express';
import { getMe,loginUser,createRegister,logoutUser } from '../controller/authController.js';
import { validateToken } from '../middleware/createTokens.js';
import { validate } from '../middleware/validate.js';
import { loginSchema,registerSchema } from '../validator/authValidator.js';

const router=express.Router();

router.post('/login',validate(loginSchema),loginUser);
router.post('/register',validate(registerSchema),createRegister);
router.get('/me',validateToken,getMe);
router.post('/logout',logoutUser);

export default router;