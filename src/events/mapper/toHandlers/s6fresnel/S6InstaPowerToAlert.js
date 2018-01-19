import { types } from '../../../../common/alertConsts';

const S6InstaPowerToAlert = e => ({
  deviceId: e.Payload.deviceId,
  type: types.ALERT_TYPE_DEVICE_BROKEN,
});

export default S6InstaPowerToAlert;
