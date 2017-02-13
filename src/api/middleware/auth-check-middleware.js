'use strict';

import jwt from 'express-jwt';

export default ({ secret, clientId }) => () => {
    return jwt({
        secret: secret,
        audience: clientId
    });
}