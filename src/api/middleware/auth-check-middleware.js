

import jwt from 'express-jwt';

export default ({ secret, clientId }) => () => jwt({
  secret,
  audience: clientId,
});
