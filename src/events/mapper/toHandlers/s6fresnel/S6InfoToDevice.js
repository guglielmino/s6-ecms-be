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
    location: e.Payload.location,
    groups: [e.Payload.location],
    commands: makeCommands(e.Payload.location, e.Payload.deviceId),
    created: new Date(),
  },
});

export default S6InfoToDevice;
