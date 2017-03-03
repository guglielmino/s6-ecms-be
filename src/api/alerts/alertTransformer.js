const transformAlert = alert => ({
  gateway: alert.gateway,
  date: alert.date,
  deviceId: alert.deviceId,
  message: alert.message,
  read: alert.read,
});


export { transformAlert }; // eslint-disable-line import/prefer-default-export
