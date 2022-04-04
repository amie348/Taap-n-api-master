const Joi = require('joi');

const validateUserSchema = (user) => {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(255).required(),
    lastName: Joi.string().min(3).max(255).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(7).max(255).required(),
    address: Joi.string().min(3).max(255).required(),
    phoneNumber: Joi.string().min(9).max(13).required(),
  });
  return schema.validate(user);
};

const buyTicketSchema = (ticket) => {
  const schema = Joi.object({
    userId: Joi.string().min(3).max(255).required(),
    ticketId: Joi.string().min(3).max(255).required(),
    amount: Joi.number().integer().min(0).required(),
  });
  return schema.validate(ticket);
};

const createServiceSchema = (service) => {
  const schema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().min(3).max(255).required(),
    price: Joi.number().integer().min(0).required(),
  });
  return schema.validate(service);
};

const updateServiceSchema = (service) => {
  const schema = Joi.object({
    serviceId: Joi.string().required(),
    price: Joi.number().integer().min(0).required(),
  });
  return schema.validate(service);
};

const deleteServiceSchema = (service) => {
  const schema = Joi.object({
    serviceId: Joi.string().required(),
    id: Joi.string().required(),
  });
  return schema.validate(service);
};

const validate = {
  validateUserSchema,
  buyTicketSchema,
  createServiceSchema,
  updateServiceSchema,
  deleteServiceSchema,
};

module.exports = validate;
