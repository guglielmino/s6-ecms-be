import Joi from 'joi';

module.exports = {
  options: { allowUnknownBody: false },
  body: {
    op: Joi.string().valid(['replace']).required(),
    path: Joi.string().valid(['/description']).required(),
    value: Joi.any().required(),
  },
};
