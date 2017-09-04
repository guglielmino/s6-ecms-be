// AppName values set in firmware
const FRESNEL_MODULENAME = 'S6 Fresnel Module';

const makeCommands = (location, deviceId) => Object.assign({}, {
  power: `mqtt:building/${location}/devices/${deviceId}/power`,
});

export default function infoMapper(e) {
  return {
    Type: e.Type,
    Payload: {
      name: e.Payload.name,
      description: e.Payload.name,
      gateway: e.GatewayId,
      swVersion: e.Payload.version,
      deviceType: e.Payload.appName,
      deviceId: e.Payload.deviceId || '00:00:00:00:00:00',
      commands: makeCommands(e.Payload.location, e.Payload.deviceId),
      created: new Date(),
    },
  };
}

export { FRESNEL_MODULENAME };
