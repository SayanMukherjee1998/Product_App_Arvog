const Joi = require("joi");

const uuidRegex = /^[0-9a-fA-F-]{36}$/;

exports.createProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  image: Joi.string().uri().optional(),
  price: Joi.number().min(0).required(),
  categoryId: Joi.string().required(),
});

exports.updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  image: Joi.string().uri().optional(),
  price: Joi.number().min(0).optional(),
  categoryId: Joi.string().optional(),
}).min(1); // at least one field required

exports.getProductByIdSchema = Joi.object({
  id: Joi.string().length(24).required(), // Mongo ObjectId
});

exports.productListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),

  sort: Joi.string()
    .valid(
      "price:asc", "price:desc",
      "name:asc", "name:desc",
      "createdAt:asc", "createdAt:desc"
    )
    .default("createdAt:desc"),

  search: Joi.string().optional().allow(""),
  categoryId: Joi.string().optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
});
