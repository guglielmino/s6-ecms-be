

const transformDevice = device => ({
  name: device.name,
  deviceId: device.deviceId,
  type: device.deviceType,
  version: device.swVersion,
  status: device.status ? device.status : {},
  id: device._id, // eslint-disable-line no-underscore-dangle
});

export { transformDevice }; // eslint-disable-line import/prefer-default-export
