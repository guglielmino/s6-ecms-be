const transformHourlyStat = stat => ({
  deviceId: stat.deviceId || stat._id.deviceId ? stat.deviceId || stat._id.deviceId : '', // eslint-disable-line no-underscore-dangle
  deviceName: stat.device && stat.device[0] ? stat.device[0].description : '',
  power: stat.power,
  date: stat.date || stat._id.date, // eslint-disable-line no-underscore-dangle
});

export { transformHourlyStat }; // eslint-disable-line import/prefer-default-export
