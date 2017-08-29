export default function powerConsumeMapper(e) {
  return { ...e,
    Payload: {
      ...e.Payload,
      created: new Date(),
    },
  };
}
