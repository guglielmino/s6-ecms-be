const transformAlert = alert => ({
  gateway: alert.gateway,
  date: alert.date,
  deviceId: alert.deviceId,
  message: alert.message,
  read: alert.read,
  id: alert._id, // eslint-disable-line no-underscore-dangle
});


export { transformAlert }; // eslint-disable-line import/prefer-default-export
