const makeCommands = (topic, gateway, location, deviceId) => {
  const topicParts = (topic || '').split('/');
  let root = gateway;
  // Retro-compatibilty check to manage device using old constant "building" as topic root
  if (topicParts.length > 0 && topicParts[0] === 'building') {
    root = topicParts[0];
  }
  return Object.assign({}, { power: `mqtt:${root}/${location}/devices/${deviceId}/power` });
};

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
    commands: makeCommands(e.Payload.topic, e.GatewayId, e.Payload.group, e.Payload.deviceId),
    created: new Date(),
  },
});

export default S6InfoToDevice;
