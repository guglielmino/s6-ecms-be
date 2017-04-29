import { ALERT_CRITICAL } from '../../common/alertConsts';

const transformAlert = alert => ({
  gateway: alert.gateway,
  date: alert.date,
  deviceId: alert.deviceId,
  message: alert.message,
  read: alert.read,
  id: alert._id, // eslint-disable-line no-underscore-dangle
  level: alert.level ? alert.level : ALERT_CRITICAL,
});


export { transformAlert }; // eslint-disable-line import/prefer-default-export
