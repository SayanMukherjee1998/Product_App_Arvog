const Joi = require("joi");

exports.bulkProductSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().min(0).required(),
  image: Joi.string().uri().optional().allow(""),
  categoryId: Joi.string().required()
});
