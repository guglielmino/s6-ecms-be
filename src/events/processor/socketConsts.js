/**
 * Message type sent over WebSocket when server receives feedback
 * from gateway for a power command (ie turn on lamp)
 * @type {string}
 */
export const WS_DEVICE_POWER_FEEDBACK = 'WS_DEVICE_POWER';

/**
 * Message type for device problem alarm
 * @type {string}
 */
export const WS_DEVICE_ALARM = 'WS_ALERT_DEVICE';
