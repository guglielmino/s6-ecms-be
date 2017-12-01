const S6LwtToHandler = e => ({
  deviceId: e.Payload.deviceId,
  status: e.Payload.status,
});

export default S6LwtToHandler;
