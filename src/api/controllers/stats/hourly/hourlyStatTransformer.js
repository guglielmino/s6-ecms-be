const transformHourlyStat = stat => ({
  deviceId: stat.deviceId ? stat.deviceId : '',
  power: stat.power,
  hour: stat._id, // eslint-disable-line no-underscore-dangle
});

export { transformHourlyStat }; // eslint-disable-line import/prefer-default-export
