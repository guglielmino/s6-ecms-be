import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';

export default ({ clientID, domain }) => () => {
  const sec = jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${domain}/.well-known/jwks.json`,
  });

  return jwt({
    secret: sec,
    audience: clientID,
    issuer: `https://${domain}/`,
    algorithms: ['RS256'],
  });
};
