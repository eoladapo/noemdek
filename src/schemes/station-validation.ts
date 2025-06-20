import Joi, { ObjectSchema } from 'joi';

export const stationValidationSchema: ObjectSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    'string.empty': 'Station name is required',
    'any.required': 'Station name is required',
  }),
  type: Joi.string().valid('NNPC', 'IOC', 'Private').required().messages({
    'string.empty': 'Station type is required',
    'any.required': 'Station type is required',
    'any.only': 'Station type must be one of NNPC, IOC, or Private',
  }),
  state: Joi.string().required().messages({
    'string.empty': 'State is required',
    'any.required': 'State is required',
  }),
  city: Joi.string().required().messages({
    'string.empty': 'City is required',
    'any.required': 'City is required',
  }),
  address: Joi.string().required().messages({
    'string.empty': 'Address is required',
    'any.required': 'Address is required',
  }),
  lga: Joi.string().required().messages({
    'string.empty': 'LGA is required',
    'any.required': 'LGA is required',
  }),
  region: Joi.string().required().messages({
    'string.empty': 'Region is required',
    'any.required': 'Region is required',
  }),
});
