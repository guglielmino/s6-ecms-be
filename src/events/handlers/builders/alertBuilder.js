import { levels, types } from '../../../common/alertConsts';

function AlertBuilder(gateway, deviceId, message) {
  this.alert = {
    gateway,
    deviceId,
    message,
    date: new Date(),
    read: false,
    open: true,
    type: types.ALERT_TYPE_UNKNOWN,
    level: levels.ALERT_INFO,
  };
}

AlertBuilder.prototype.setGateway = function setGateway(gateway) {
  this.alert.gateway = gateway;
  return this;
};

AlertBuilder.prototype.setDeviceId = function setDeviceId(deviceId) {
  this.alert.deviceId = deviceId;
  return this;
};

AlertBuilder.prototype.setMessage = function setMessage(message) {
  this.alert.message = message;
  return this;
};

AlertBuilder.prototype.setDate = function setDate(date) {
  this.alert.date = date;
  return this;
};

AlertBuilder.prototype.setRead = function setRead(read) {
  this.alert.read = read;
  return this;
};

AlertBuilder.prototype.setLevel = function setLevel(level) {
  this.alert.level = level;
  return this;
};

AlertBuilder.prototype.setKey = function setKey(key) {
  this.alert.key = key;
  return this;
};

AlertBuilder.prototype.setType = function setType(type) {
  this.alert.type = type;
  return this;
};

AlertBuilder.prototype.build = function build() {
  return this.alert;
};

export default AlertBuilder;
