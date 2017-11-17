const APPEventToHandler = msg => ({
  deviceId: msg.deviceId,
  gateway: msg.gateway,
  requestStatus: msg.requestStatus,
});

export default APPEventToHandler;
