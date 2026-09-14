import Joi from "joi";
export const cartSchema=Joi.object({
    productId:Joi.string()
    .guid({version:['uuidv4']})
    .required()
    .messages({
        'any.required':'product id is required',
        'string.guid':'product ID must be valid UUID'
    }),
    quantity: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            'any.required': 'Quantity is required',
            'number.base': 'Quantity must be a number',
            'number.min': 'Quantity must be at least 1'
        }),
        deliveryOptionId: Joi.string()
        .required()
        .messages({
            'any.required': 'Delivery option is required',
            'string.empty': 'Delivery option cannot be empty'
        })
 });

 export const updateCartSchema = Joi.object({
    /*cartId: Joi.number()
        .integer()
        .required()
        .messages({
            'any.required': 'Cart ID is required',
            'number.base': 'Cart ID must be a number'
        }),*/

    quantity: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .required()
        .messages({
            'any.required': 'Quantity is required',
            'number.min': 'Quantity must be at least 1',
            'number.max':'Quantiy should not exceed 100'
        })
 });

 export const updateDeliveryOptionSchema = Joi.object({
    cartId: Joi.number()
        .integer()
        .required()
        .messages({
            'any.required': 'Cart ID is required',
            'number.base': 'Cart ID must be a number'
        }),

    deliveryOptionId: Joi.string().valid
        ('1','2','3').required()
        .messages({
            'any.required': 'Delivery option is required',
            'string.empty': 'Delivery option cannot be empty'
        })
});