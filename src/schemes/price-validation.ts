import Joi, { ObjectSchema } from 'joi';

export const priceValidationSchema: ObjectSchema = Joi.object({
  station: Joi.string().hex().length(24).required().messages({
    'string.empty': 'Station ID is required',
    'string.hex': 'Station ID must be a valid hexadecimal string',
    'string.length': 'Station ID must be 24 characters long',
    'any.required': 'Station ID is required',
  }),
  product: Joi.string().valid('PMS', 'AGO', 'DPK', 'LPG', 'ICE').required().messages({
    'string.empty': 'Product type is required',
    'any.required': 'Product is required',
    'any.only': 'Product must be one of PMS, AGO, DPK, LPG, or ICE',
  }),
  price: Joi.number().positive().required().messages({
    'number.base': 'Price must be a number',
    'number.positive': 'Price must be a positive number',
    'any.required': 'Price is required',
  }),
  date: Joi.date().default(Date.now).messages({
    'date.base': 'Date must be a valid date',
    'any.default': 'Date is set to current date by default',
  }),
});

export const bulkPriceValidationSchema: Joi.ArraySchema = Joi.array().items(priceValidationSchema).messages({
  'array.base': 'Bulk prices must be provided as an array',
  'array.includes': 'Each item in the array must be a valid price object',
});
