import { types } from '../../../../common/alertConsts';

const LwtAPPEventToAlertHandler = msg => ({
  deviceId: msg.device.deviceId,
  status: msg.status,
  type: types.ALERT_TYPE_DEVICE_STATUS,
});

export default LwtAPPEventToAlertHandler;
