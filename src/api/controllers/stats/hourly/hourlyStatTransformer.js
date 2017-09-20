const transformHourlyStat = stat => ({
  deviceId: stat.deviceId || stat._id.deviceId ? stat.deviceId || stat._id.deviceId : '', // eslint-disable-line no-underscore-dangle
  deviceName: stat.device && stat.device[0] ? stat.device[0].name : '',
  power: stat.power,
  hour: stat.hour || stat._id.hour, // eslint-disable-line no-underscore-dangle
});

export { transformHourlyStat }; // eslint-disable-line import/prefer-default-export
