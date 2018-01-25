import Joi from 'joi';

const deviceGroupsPatchValidation = {
  options: { allowUnknownBody: false },
  body: {
    op: Joi.string().valid(['replace']).required(),
    path: Joi.string().valid(['/description']).required(),
    value: Joi.any().required(),
  },
};

export default deviceGroupsPatchValidation;
