import pool from "../config/db.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const updateDeliveryOption=asyncHandler(async (req,res)=>{
    
        const userId=req.user.id;
        const{cartId,deliveryOptionId}=req.body;

       const [result]= await pool.query(`UPDATE cart
            SET delivery_option_id=?
            WHERE user_id=? AND id=?`,
            [deliveryOptionId,userId,cartId]);

        if (result.affectedRows === 0) {
            const error = new Error('Cart item not found');
            error.status = 404;
            throw error;
        }


        res.status(200).json({message:'Delivery option updated successfully'});
        
    
    
})