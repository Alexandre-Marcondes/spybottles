import Joi from 'joi';

export const productValidationSchema = Joi.object({
  brand: Joi.string().trim().required(),
  variant: Joi.string().trim().optional(),

  category: Joi.string().valid('wine', 'spirit', 'beer', 'other').required(),
  varietal: Joi.string().allow(null, '').optional(),

  vintage: Joi.number().min(1900).max(2100).allow(null).optional(),

  size_ml: Joi.number().min(50).max(5000).default(750),
  unit: Joi.string().trim().optional(),

  appellation: Joi.string().trim().optional(), // ✅ NEW
  country: Joi.string().trim().optional(),     // ✅ NEW

  quantity_full: Joi.number().min(0),
  quantity_partial: Joi.number().min(0).max(1),
  
  location: Joi.string().trim().required(),
  notes: Joi.string().trim().optional(),
}).or('quantity_full', 'quantity_partial');

