const Joi = require("joi");

const validateEvent = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    starttime: Joi.date().required(),
    endtime: Joi.date().greater(Joi.ref("starttime")).required(),
    category_ids:Joi.array().items(Joi.number()).required()
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  next();
};

module.exports = { validateEvent };
