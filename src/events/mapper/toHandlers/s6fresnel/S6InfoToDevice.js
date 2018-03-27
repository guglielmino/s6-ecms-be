const makeCommands = (location, deviceId) => Object.assign({}, {
  power: `mqtt:building/${location}/devices/${deviceId}/power`,
});

const S6InfoToDevice = e => ({
  deviceId: e.Payload.deviceId || '00:00:00:00:00:00',
  payload: {
    name: e.Payload.name,
    description: e.Payload.name,
    gateway: e.GatewayId,
    swVersion: e.Payload.version,
    deviceType: e.Payload.appName,
    deviceId: e.Payload.deviceId || '00:00:00:00:00:00',
    group: e.Payload.group,
    features: e.Payload.features || [],
    commands: makeCommands(e.Payload.group, e.Payload.deviceId),
    created: new Date(),
  },
});

export default S6InfoToDevice;
