

const transformDevice = device => ({
  name: device.name,
  deviceId: device.deviceId,
  type: device.deviceType,
  version: device.swVersion,
  status: device.status ? device.status : {},
});

export { transformDevice }; // eslint-disable-line import/prefer-default-export
