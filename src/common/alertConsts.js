export const levels = {
  ALERT_WARNING: 'warning',
  ALERT_CRITICAL: 'critical',
  ALERT_INFO: 'info',
};

export const types = {
  ALERT_TYPE_UNKNOWN: 'Unknown alert',
  ALERT_TYPE_DEVICE_STATUS: 'Device_status',
  ALERT_TYPE_DEVICE_BROKEN: 'Device_broken',
  ALERT_TYPE_POWER_SWITCH_FAIL: 'Power_switch_fail',
};

export const alertKey = (type, gateway, deviceId) => (`alert:${type}:${gateway}:${deviceId}`);
