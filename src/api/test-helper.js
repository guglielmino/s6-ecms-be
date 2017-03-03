/**
 * Fill user data in request object to simulate action of
 * real JWT Auth middleware
 *
 * @param FakeAuthMiddleware
 * @returns {function(): function(*, *, *)}
 * @constructor
 */
const FakeAuthMiddleware = userGateways => () => (req, res, next) => {
  req.user = { // eslint-disable-line no-param-reassign
    app_metadata: {
      gateways: userGateways,
    },
  };
  next();
};

export { FakeAuthMiddleware }; // eslint-disable-line import/prefer-default-export
