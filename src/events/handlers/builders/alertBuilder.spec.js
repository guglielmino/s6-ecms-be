import chai from 'chai';
import sinon from 'sinon';

chai.should();
const expect = chai.expect;

import AlertBuilder from './alertBuilder';

describe('Alert builder', () => {

  it('should create the alert object with default fields', () => {
    const alertBuilder = new AlertBuilder('sample_gateway', '00:11:22:33:44:55', 'an alert');

    const alert = alertBuilder.build();

    alert.gateway.should.be.eq('sample_gateway');
    alert.deviceId.should.be.eq('00:11:22:33:44:55');
    alert.message.should.be.eq('an alert');
    alert.level.should.be.eq('info');
    alert.read.should.be.false;
    alert.date.should.be.an('Date');
    expect(alert.key).to.be.undefined;
  });

  it('should change gateway fileld', () => {
    const alertBuilder = new AlertBuilder('sample_gateway', '00:11:22:33:44:55', 'an alert');

    alertBuilder.setGateway('gateway_2');
    const alert = alertBuilder.build();

    alert.gateway.should.be.eq('gateway_2');
  });

  it('should change deviceId fileld', () => {
    const alertBuilder = new AlertBuilder('sample_gateway', '00:11:22:33:44:55', 'an alert');

    alertBuilder.setDeviceId('00:00:00:00:00:00');
    const alert = alertBuilder.build();

    alert.deviceId.should.be.eq('00:00:00:00:00:00');
  });

  it('should change message fileld', () => {
    const alertBuilder = new AlertBuilder('sample_gateway', '00:11:22:33:44:55', 'an alert');

    alertBuilder.setMessage('all right!');
    const alert = alertBuilder.build();

    alert.message.should.be.eq('all right!');
  });

  it('should change level fileld', () => {
    const alertBuilder = new AlertBuilder('sample_gateway', '00:11:22:33:44:55', 'an alert');

    alertBuilder.setLevel('warning');
    const alert = alertBuilder.build();

    alert.level.should.be.eq('warning');
  });

  it('should change read fileld', () => {
    const alertBuilder = new AlertBuilder('sample_gateway', '00:11:22:33:44:55', 'an alert');

    alertBuilder.setRead(true);
    const alert = alertBuilder.build();

    alert.read.should.be.true;
  });

  it('should change date fileld', () => {
    const date = new Date('2017-08-01T00:00:000Z');
    const alertBuilder = new AlertBuilder('sample_gateway', '00:11:22:33:44:55', 'an alert');

    alertBuilder.setDate(date);
    const alert = alertBuilder.build();

    alert.date.should.be.eq(date);
  });

  it('should add key fileld', () => {
    const alertBuilder = new AlertBuilder('sample_gateway', '00:11:22:33:44:55', 'an alert');

    alertBuilder.setKey('a key');
    const alert = alertBuilder.build();

    alert.key.should.be.eq('a key');
  });
});
