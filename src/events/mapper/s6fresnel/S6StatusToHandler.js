const S6StatusToHandler = e => ({
  deviceId: e.Payload.deviceId,
  powerStatus: e.Payload.status,
});

export default S6StatusToHandler;
