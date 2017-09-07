const transformHourlyStat = stat => ({
  deviceId: stat._id.deviceId ? stat._id.deviceId : '', // eslint-disable-line no-underscore-dangle
  power: stat.power,
  hour: stat._id.hour, // eslint-disable-line no-underscore-dangle
});

export { transformHourlyStat }; // eslint-disable-line import/prefer-default-export
