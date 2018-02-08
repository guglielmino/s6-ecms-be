const usersTransformers = user => ({
  userId: user.user_id,
  name: user.name,
  email: user.email,
  gateways: user.gateways,
  roles: user.roles,
  created: user.created_at,
  lastLogin: new Date(),
});


export default usersTransformers;
