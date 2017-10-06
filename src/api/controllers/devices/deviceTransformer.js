

const transformDevice = device => ({
  name: device.name,
  description: device.description,
  gateway: device.gateway,
  deviceId: device.deviceId,
  type: device.deviceType,
  version: device.swVersion,
  status: device.status ? device.status : {},
  tags: device.tags ? device.tags : [],
  id: device._id, // eslint-disable-line no-underscore-dangle
});

export { transformDevice }; // eslint-disable-line import/prefer-default-export
