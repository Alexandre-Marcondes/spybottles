// src/spiritsBeerProduct/validators/spiritsBeerProductValidationSchema.ts

import Joi from 'joi';

export const spiritsBeerProductValidationSchema = Joi.object({
  brand: Joi.string().trim().required(),
  variant: Joi.string().trim().optional(),

  category: Joi.string().valid('spirits', 'beer').required(),

  age: Joi.number().min(1).max(100).optional(),
  cask: Joi.string().trim().optional(),

  abv: Joi.number().min(0).max(100).optional(),

  size_ml: Joi.number().min(50).max(5000).default(750),
  unit: Joi.string().trim().optional(),

  country: Joi.string().trim().optional(),
  region: Joi.string().trim().optional(),

  quantity_full: Joi.number().min(0),
  quantity_partial: Joi.number().min(0).max(1),

  location: Joi.string().trim().optional(),
  notes: Joi.string().trim().optional(),
}).or('quantity_full', 'quantity_partial');
