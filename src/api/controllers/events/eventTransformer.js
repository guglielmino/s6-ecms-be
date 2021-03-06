const transformEvent = event => ({
  yesterday: event.Payload.Yesterday,
  today: event.Payload.Today,
  period: event.Payload.Period,
  voltage: event.Payload.Voltage,
  time: event.Payload.Time,
  id: event._id, // eslint-disable-line no-underscore-dangle
});

export { transformEvent }; // eslint-disable-line import/prefer-default-export
