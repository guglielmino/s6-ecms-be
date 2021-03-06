import SonoffPowTopicHanlders from '../../../../services/sonoffPowTopicHandler';

// AppName values set in firmware
const SONOFF = 'Sonoff 8266 Module'; // Sonoff Basic, Sonoff RF, Sonoff SV, Sonoff Dual, Sonoff TH, S20 Smart Socket
const SONOFF_POW = 'Sonoff Pow Module'; // Sonoff Pow
const SONOFF_2 = 'Sonoff 8285 Module'; // Sonoff Touch, Sonoff 4CH
const MOTOR_CAC = 'Motor C/AC Module'; // iTead Motor Clockwise/Anticlockwise
const ELECTRO_DRAGON = 'ElectroDragon Module'; // Electro Dragon Wifi IoT Relay Board Based on ESP8266

const sonoffPowTopicHanlders = SonoffPowTopicHanlders();

function commandPerDevice(appName, topic) {
  let ret = {};

  switch (appName) {
    case SONOFF_POW:
      ret = Object.assign({}, {
        power: sonoffPowTopicHanlders.makePowerCommandFromCmndTopic(topic),
      });
      break;
    default:
      ret = {};
      break;
  }

  return ret;
}

function namePerDevice(appName, topic) {
  let ret = '';

  switch (appName) {
    case SONOFF_POW:
      ret = sonoffPowTopicHanlders.extractNameFromCommandTopic(topic, 'NO NAME');
      break;
    default:
      ret = '';
      break;
  }

  return ret;
}


const SONInfoToDevice = e => ({
  deviceId: e.Payload.DeviceId || '00:00:00:00:00:00',
  payload: {
    name: namePerDevice(e.Payload.AppName, e.Payload.Topic),
    description: namePerDevice(e.Payload.AppName, e.Payload.Topic),
    gateway: e.GatewayId,
    swVersion: e.Payload.Version,
    deviceType: e.Payload.AppName,
    deviceId: e.Payload.DeviceId || '00:00:00:00:00:00',
    commands: commandPerDevice(e.Payload.AppName, e.Payload.Topic),
    created: new Date(),
  },
});

export default SONInfoToDevice;
export { SONOFF, SONOFF_POW, SONOFF_2, MOTOR_CAC, ELECTRO_DRAGON };
