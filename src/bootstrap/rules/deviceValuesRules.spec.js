import sinon from 'sinon';

import chai from 'chai';

import EventsRuleEngine from '../../services/eventsRuleEngine';
import DeviceValuesHandler from '../../events/handlers/device/common/values/deviceValuesHandler';
import DeviceValuesRules from './deviceValuesRules';

chai.should();
const expect = chai.expect();

describe('Device values rules', () => {
  let ruleEngine;
  let deviceValuesHandler;

  beforeEach(() => {
    deviceValuesHandler = DeviceValuesHandler();

    sinon.stub(deviceValuesHandler);

    ruleEngine = new EventsRuleEngine();
    DeviceValuesRules(ruleEngine, {
      deviceValuesHandler,
    });
  });

  it('should call devicevalues handler with correct payload for current consume', () => {
    const msg = {
      Type: 'FRESNEL_CURRENT_CONSUME',
      GatewayId: 'TESTGW',
      Payload: {
        value: '10',
        unit: 'A',
        timestamp: '2017-11-30T07:56:23.642Z',
      },
    };
    ruleEngine.handle(msg);

    deviceValuesHandler.process
      .calledOnce.should.be.true;

    deviceValuesHandler.process
      .calledWith({
        timestamp: '2017-11-30T07:56:23.642Z',
        gateway: 'TESTGW',
        deviceId: undefined,
        value: '10',
        unit: 'A',
        type: 'FRESNEL_CURRENT_CONSUME',
      }).should.be.true;
  });

  it('should call devicevalues handler with correct payload for voltage measurement', () => {
    const msg = {
      Type: 'FRESNEL_VOLTAGE',
      GatewayId: 'TESTGW',
      Payload: {
        value: '100',
        unit: 'V',
        timestamp: '2017-11-30T07:56:23.642Z',
      },
    };
    ruleEngine.handle(msg);

    deviceValuesHandler.process
      .calledOnce.should.be.true;

    deviceValuesHandler.process
      .calledWith({
        timestamp: '2017-11-30T07:56:23.642Z',
        gateway: 'TESTGW',
        deviceId: undefined,
        value: '100',
        unit: 'V',
        type: 'FRESNEL_VOLTAGE',
      }).should.be.true;
  });

  it('should call devicevalues handler with correct payload for frequency measurement', () => {
    const msg = {
      Type: 'FRESNEL_FREQUENCY',
      GatewayId: 'TESTGW',
      Payload: {
        value: '50',
        unit: 'Hz',
        timestamp: '2017-11-30T07:56:23.642Z',
      },
    };
    ruleEngine.handle(msg);

    deviceValuesHandler.process
      .calledOnce.should.be.true;

    deviceValuesHandler.process
      .calledWith({
        timestamp: '2017-11-30T07:56:23.642Z',
        gateway: 'TESTGW',
        deviceId: undefined,
        value: '50',
        unit: 'Hz',
        type: 'FRESNEL_FREQUENCY',
      }).should.be.true;
  });

  it('should call devicevalues handler with correct payload for power factor measurement', () => {
    const msg = {
      Type: 'FRESNEL_POWER_FACTOR',
      GatewayId: 'TESTGW',
      Payload: {
        value: '0.89',
        unit: '',
        timestamp: '2017-11-30T07:56:23.642Z',
      },
    };
    ruleEngine.handle(msg);

    deviceValuesHandler.process
      .calledOnce.should.be.true;

    deviceValuesHandler.process
      .calledWith({
        timestamp: '2017-11-30T07:56:23.642Z',
        gateway: 'TESTGW',
        deviceId: undefined,
        value: '0.89',
        unit: '',
        type: 'FRESNEL_POWER_FACTOR',
      }).should.be.true;
  });

  it('should call devicevalues handler with correct payload for reactive power measurement', () => {
    const msg = {
      Type: 'FRESNEL_REACTIVE_POWER_CONSUME',
      GatewayId: 'TESTGW',
      Payload: {
        value: '0.5',
        unit: 'VA',
        timestamp: '2017-11-30T07:56:23.642Z',
      },
    };
    ruleEngine.handle(msg);

    deviceValuesHandler.process
      .calledOnce.should.be.true;

    deviceValuesHandler.process
      .calledWith({
        timestamp: '2017-11-30T07:56:23.642Z',
        gateway: 'TESTGW',
        deviceId: undefined,
        value: '0.5',
        type: 'FRESNEL_REACTIVE_POWER_CONSUME',
        unit: 'VA',
      }).should.be.true;
  });

  it('should call devicevalues handler with correct payload for power consume measurement', () => {
    const msg = {
      Type: 'FRESNEL_POWER_CONSUME',
      GatewayId: 'TESTGW',
      Payload: {
        value: '25',
        unit: 'W',
        deviceId: '123',
        timestamp: '2018-05-30T07:56:23.642Z',
      },
    };
    ruleEngine.handle(msg);

    deviceValuesHandler.process
      .calledOnce.should.be.true;

    deviceValuesHandler.process
      .calledWith({
        timestamp: '2018-05-30T07:56:23.642Z',
        gateway: 'TESTGW',
        deviceId: '123',
        value: '25',
        type: 'FRESNEL_POWER_CONSUME',
        unit: 'W',
      }).should.be.true;
  });

  it('should not call device values handler if event type is not recognized', () =>{
    const msg = {
      Type: 'OTHER_EVENT',
      GatewayId: 'TESTGW',
      Payload: {
        value: '0.5',
        unit: 'VA',
        timestamp: '2017-11-30T07:56:23.642Z',
      },
    };
    ruleEngine.handle(msg);

    deviceValuesHandler.process.called.should.be.false;
  })
});
