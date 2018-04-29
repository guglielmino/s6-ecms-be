const S6CrontabToDeviceCrontab = e => ({
  deviceId: e.Payload.deviceId || '00:00:00:00:00:00',
  payload: {
    crontab: e.Payload.items,
  },
});

export default S6CrontabToDeviceCrontab;
