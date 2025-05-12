import Joi from 'joi';

// ✅ Validate one inventory item
const sessionItemSchema = Joi.object({
  productId: Joi.string().optional().allow('', null),
  quantity_full: Joi.number().min(0),
  quantity_partial: Joi.number().min(0).max(1),
}).or('quantity_full', 'quantity_partial'); // At least one required

// ✅ Validate full session
export const inventorySessionSchema = Joi.object({
  location: Joi.string().optional(),
  notes: Joi.string().optional(),
  items: Joi.array().items(sessionItemSchema).min(1).required(),
});

