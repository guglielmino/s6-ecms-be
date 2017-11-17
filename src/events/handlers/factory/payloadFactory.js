import S6FresnelUpdateFirmwareCommandToGateway from '../../mapper/toGateway/s6fresnel/S6FresnelUpdateFirmwareCommandToGateway';
import SONUpdateFirmwareCommandToGateway from '../../mapper/toGateway/sonoff/SONUpdateFirmwareCommandToGateway';

import S6FresnelPowerCommandToGateway from '../../mapper/toGateway/s6fresnel/S6FresnelPowerCommandToGateway';
import SONPowerCommandToGateway from '../../mapper/toGateway/sonoff/SONPowerCommandToGateway';

function PayloadFactory() {
  this.devicesCommands = {
    firmwareUpdate: {
      sonoff: SONUpdateFirmwareCommandToGateway,
      'S6 Fresnel Module': S6FresnelUpdateFirmwareCommandToGateway,
    },
    powerSwitch: {
      sonoff: SONPowerCommandToGateway,
      'S6 Fresnel Module': S6FresnelPowerCommandToGateway,
    },
  };
}

PayloadFactory.prototype.createFirmwareUpdatePayload = function createFirmwareUpdatePayload(dev) {
  const firmwarePayload = this.devicesCommands.firmwareUpdate[dev.deviceType];
  return firmwarePayload(dev);
};

PayloadFactory.prototype.createPowerSwitchPayload = function createPowerSwitchPayload(dev, value) {
  const powerSwitchPayload = this.devicesCommands.powerSwitch[dev.deviceType];
  return powerSwitchPayload(dev, value);
};


export default PayloadFactory;
