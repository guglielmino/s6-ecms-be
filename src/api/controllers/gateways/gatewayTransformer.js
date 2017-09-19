

const transformGateway = gateway => ({
  code: gateway.code,
  description: gateway.description,
  authKey: gateway.authKey,
  id: gateway._id, // eslint-disable-line no-underscore-dangle
});

export { transformGateway }; // eslint-disable-line import/prefer-default-export
