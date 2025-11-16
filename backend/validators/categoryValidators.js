const Joi = require("joi");

exports.createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  slug: Joi.string().min(2).max(100).required(),
  description: Joi.string().allow("").optional()
});

exports.updateCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  slug: Joi.string().min(2).max(100).optional(),
  description: Joi.string().allow("").optional()
}).min(1);

exports.getCategoryByIdSchema = Joi.object({
  id: Joi.string().length(24).required()
});
