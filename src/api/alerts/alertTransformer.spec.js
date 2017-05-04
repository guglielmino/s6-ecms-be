/**
 * Created by alessiapileri on 27/04/2017.
 */
import chai from 'chai';
import sinon from 'sinon';

import { ALERT_CRITICAL, ALERT_INFO } from '../../common/alertConsts';
import { transformAlert } from './alertTransformer';

describe('alert transformer', () => {
  const expect = chai.expect;

  it('should transform alert in response object', () => {
    const fakeDate = new Date();

    const result = transformAlert({
      _id: '590105c698aa4e001af6b149',
      gateway: 'VG59',
      date: fakeDate,
      deviceId: '5C:CF:7F:A0:16:46',
      message: '5C:CF:7F:A0:16:46 doesn\'t respond to turn on',
      read: false,
      level: ALERT_INFO,
    });
    expect(result.id).to.equal('590105c698aa4e001af6b149');
    expect(result.gateway).to.equal('VG59');
    expect(result.date).to.equal(fakeDate);
    expect(result.deviceId).to.equal('5C:CF:7F:A0:16:46');
    expect(result.message).to.equal('5C:CF:7F:A0:16:46 doesn\'t respond to turn on');
    expect(result.read).to.equal(false);
    expect(result.level).to.equal(ALERT_INFO);
  });

  it('should map to ALERT_CRITICAL if level is unspecified', () => {
    const fakeDate = new Date();

    const result = transformAlert({
      _id: '590105c698aa4e001af6b149',
      gateway: 'VG59',
      date: fakeDate,
      deviceId: '5C:CF:7F:A0:16:46',
      message: '5C:CF:7F:A0:16:46 doesn\'t respond to turn on',
      read: false,
    });

    expect(result.level).to.equal(ALERT_CRITICAL);
  });



});
