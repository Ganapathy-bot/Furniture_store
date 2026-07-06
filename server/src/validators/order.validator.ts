import Joi from 'joi';

const cartItemSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).max(99).required(),
});

const shippingSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^[0-9+\-\s]{10,15}$/).required(),
  line1: Joi.string().min(5).max(200).required(),
  line2: Joi.string().max(200).allow('', null),
  city: Joi.string().min(2).max(100).required(),
  state: Joi.string().min(2).max(100).required(),
  pinCode: Joi.string().pattern(/^[0-9]{6}$/).required(),
});

export const createOrderSchema = Joi.object({
  items: Joi.array().items(cartItemSchema).min(1).required(),
  shippingAddress: shippingSchema.required(),
});

export const verifySessionSchema = Joi.object({
  sessionId: Joi.string().required(),
});