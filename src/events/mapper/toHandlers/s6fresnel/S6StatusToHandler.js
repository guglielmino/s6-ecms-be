const S6StatusToHandler = e => ({
  deviceId: e.Payload.deviceId,
  powerStatus: {
    relayIndex: `Relay${e.Payload.status.relay_idx || 0}`,
    status: e.Payload.status.power || e.Payload.status,
  },
});

export default S6StatusToHandler;
