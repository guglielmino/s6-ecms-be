// TODO: validate parameter with Flow
// (gatewayTokenValidator must be a function accepting two string)

export default gatewayTokenValidator => (req, res, next) => {
  const gatewayId = req.headers['x-s6-gatewayid'];
  const authToken = req.headers['x-s6-auth-token'];
  if (!gatewayId || !authToken) {
    res.sendStatus(401);
    next(new Error('Unauthorized'));
  } else {
    gatewayTokenValidator(gatewayId, authToken)
      .then((result) => {
        if (result) {
          next();
        } else {
          res.sendStatus(401);
          next();
        }
      })
      .catch(() => {
        res.sendStatus(401);
        next();
      });
  }
};
