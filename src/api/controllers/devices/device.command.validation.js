import Joi from 'joi';
import * as consts from '../../../../consts';

module.exports = {
  options: { allowUnknownBody: false },
  body: {
    command: Joi.string().valid([consts.APPEVENT_TYPE_POWER,
      consts.APPEVENT_TYPE_FIRMWARE]).required(),
    gateway: Joi.string().required(),
    param: Joi.any().optional(),
  },
};
