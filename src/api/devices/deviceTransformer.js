

const transformDevice = device => ({
  name: device.name,
  deviceId: device.deviceId,
  type: device.deviceType,
  version: device.swVersion,
});

export { transformDevice }; // eslint-disable-line import/prefer-default-export
