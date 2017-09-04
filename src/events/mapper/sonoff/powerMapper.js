
export default function powerMapper(e) {
  return { ...e,
    Payload: {
      Topic: e.Payload.Topic,
      Power: e.Payload.Power.toLowerCase(),
      DeviceId: e.Payload.DeviceId,
    },
  };
}
