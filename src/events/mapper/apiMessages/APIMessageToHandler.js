const APIMessageToFirmwareUpdate = msg => ({
  deviceId: msg.deviceId,
  gateway: msg.gateway,
  param: msg.param || null,
});

export default APIMessageToFirmwareUpdate;
