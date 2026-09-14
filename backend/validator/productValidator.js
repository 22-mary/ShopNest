import Joi from "joi";

export const productSchema=Joi.object({
    name:Joi.string().trim().required()
    .messages({
        "string.empty": "Product name is required.",
        "any.required": "Product name is required."
    }),
    brand:Joi.string().trim().required()
    .messages({
        "string.empty": "Product brand is required.",
        "any.required": "Product brand is required."
    }),
    category:Joi.string().trim().required()
    .messages({
        "string.empty": "Product name is required.",
        "any.required": "Product name is required."
    }),
    priceCents:Joi.number().positive().required()
    .messages({
        "number.base": "Price must be a number.",
        "number.positive": "Price must be greater than 0.",
        "any.required": "Price is required."
    }),
    image:Joi.string().pattern(/^(https?:\/\/.+|images\/.+)$/).required()
    .messages({
        "string.pattern.base": "Enter a valid image URL.",
        "string.empty": "Image URL is required.",
        "any.required": "Image URL is required."
    }),
    stock: Joi.number().integer().min(0).required().messages({
        "number.base": "Stock must be a number.",
        "number.min": "Stock cannot be negative.",
        "any.required": "Stock is required."
    }),
    description:Joi.string().trim().required().messages({
        "string.empty": "Product description is required.",
        "any.required": "Product description is required."
    })

})