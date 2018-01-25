const S6InfoToDeviceGroups = e => ({
  code: e.Payload.location,
  payload: {
    gateway: e.GatewayId,
    description: e.Payload.location,
    created: new Date(),
  },
});

export default S6InfoToDeviceGroups;
