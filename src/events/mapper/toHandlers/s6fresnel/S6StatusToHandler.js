const S6StatusToHandler = e => ({
  deviceId: e.Payload.deviceId,
  powerStatus: {
    relayIndex: `Relay${e.Payload.relay_idx || 0}`,
    power: e.Payload.status || 'off',
  },
});

export default S6StatusToHandler;
