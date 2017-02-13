'use strict';

const transformEvent = (event) => {
  return {
      yesterday: event.Payload.Yesterday,
      today: event.Payload.Today,
      period: event.Payload.Period,
      voltage: event.Payload.Voltage,
      time: event.Payload.Time
  }
};

export { transformEvent };