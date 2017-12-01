const transformDeviceValues = devValue => ({
  type: devValue._id.type,  // eslint-disable-line no-underscore-dangle
  date: devValue._id.date,  // eslint-disable-line no-underscore-dangle
  value: devValue.value,
  unit: devValue.unit,
});

export default transformDeviceValues;
