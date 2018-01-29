const S6InfoToDeviceGroups = e => ({
  code: e.Payload.group,
  payload: {
    gateway: e.GatewayId,
    description: e.Payload.group,
    created: new Date(),
  },
});

export default S6InfoToDeviceGroups;
