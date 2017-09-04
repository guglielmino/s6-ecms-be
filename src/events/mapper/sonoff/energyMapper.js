export default function energyMapper(e) {
  return { ...e,
    Payload: {
      ...e.Payload,
      Current: parseFloat(e.Payload.Current),
      Yesterday: parseFloat(e.Payload.Yesterday),
      Today: parseFloat(e.Payload.Today),
      Factor: parseFloat(e.Payload.Factor),
      Time: new Date(e.Payload.Time),
      Power: parseFloat(e.Payload.Power),
      created: new Date(),
    },
  };
}
