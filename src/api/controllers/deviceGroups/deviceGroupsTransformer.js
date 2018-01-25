const transformDeviceGroup = deviceGroup => ({
  id: deviceGroup._id, // eslint-disable-line no-underscore-dangle
  code: deviceGroup.code,
  description: deviceGroup.description,
  gateway: deviceGroup.gateway,
});

export default transformDeviceGroup;
