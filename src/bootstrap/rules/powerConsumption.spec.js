import sinon from 'sinon';

import chai from 'chai';

import EventsRuleEngine from '../../services/eventsRuleEngine';

import UpdateOnlineStatusHandler from '../../events/handlers/device/common/onlineStatus/updateOnlineStatusHandler';
import HourlyStatHandler from '../../events/handlers/device/common/powerconsumption/hourlyStatHandler';
import DailyStatHandler from '../../events/handlers/device/common/powerconsumption/dailyStatHandler';
import PowerAlertHandler from '../../events/handlers/device/common/alerts/powerAlertHandler';

import PowerConsumptionRules from './powerConsumption';

chai.should();
const expect = chai.expect();

describe('Power Consumption rules', () => {
  let ruleEngine;
  let hourlyStatHandler;
  let dailyStatHandler;
  let updateOnlineStatusHandler;
  let powerAlertHandler;

  beforeEach(() => {
    hourlyStatHandler = HourlyStatHandler();
    dailyStatHandler = DailyStatHandler();
    updateOnlineStatusHandler = UpdateOnlineStatusHandler();
    powerAlertHandler = PowerAlertHandler();

    sinon.stub(hourlyStatHandler);
    sinon.stub(dailyStatHandler);
    sinon.stub(updateOnlineStatusHandler);
    sinon.stub(powerAlertHandler);

    ruleEngine = new EventsRuleEngine();
    PowerConsumptionRules(ruleEngine, {
      hourlyStatHandler,
      dailyStatHandler,
      updateOnlineStatusHandler,
      powerAlertHandler,
    });
  });

  context('S6 Fresnel device', () => {
    it('Should call hourlyStatHandler\'s process passing right values', () => {
      const event =
        {
          GatewayId: 'CASAFG',
          Type: 'FRESNEL_POWER_CONSUME',
          Payload: {
            topic: 'building/room1/sensors/00:11:22:33:44:55/power',
            deviceId: '00:11:22:33:44:55',
            timestamp: '2017-08-27T07:56:23.642Z',
            power: 23.2,
          },
        };

      ruleEngine.handle(event);

      hourlyStatHandler.process
        .calledOnce.should.be.true;
      hourlyStatHandler.process
        .calledWith({
          timestamp: '2017-08-27T07:56:23.642Z',
          gateway: 'CASAFG',
          deviceId: '00:11:22:33:44:55',
          power: 23.2
        });
    });

    it('Should call updateStatuHandler\'s process passing deviceId', () => {
      const event =
        {
          GatewayId: 'CASAFG',
          Type: 'FRESNEL_POWER_CONSUME',
          Payload: {
            topic: 'building/room1/sensors/00:11:22:33:44:55/power',
            deviceId: '00:11:22:33:44:55',
            timestamp: '2017-08-27T07:56:23.642Z',
            power: 23.2,
          },
        };

      ruleEngine.handle(event);

      updateOnlineStatusHandler.process
        .calledOnce.should.be.true;
      updateOnlineStatusHandler.process
        .calledWith({ deviceId: '00:11:22:33:44:55' });
    });

    it('Should call powerAlertHandler\'s process passing deviceId', () => {
      const event =
        {
          GatewayId: 'CASAFG',
          Type: 'FRESNEL_POWER_CONSUME',
          Payload: {
            topic: 'building/room1/sensors/00:11:22:33:44:55/power',
            deviceId: '00:11:22:33:44:55',
            timestamp: '2017-08-27T07:56:23.642Z',
            power: 23.2,
          },
        };

      ruleEngine.handle(event);

      powerAlertHandler.process
        .calledOnce.should.be.true;
      powerAlertHandler.process
        .calledWith({ deviceId: '00:11:22:33:44:55' });
    })
  });

  context('Sonoff device', () => {
    it('Should call hourlyStatHandler\'s process passing right values', () => {

      const event = {
        GatewayId: 'test',
        Type: 'ENERGY',
        Payload: {
          DeviceId: '11:11:11:22:22:33',
          Yesterday: 0.031,
          Today: 0.013,
          Period: 0,
          Power: 123,
          Factor: 0,
          Voltage: 0,
          Current: 0,
          Time: '2017-08-27T07:56:23.642Z',
          created: new Date(),
        },
      };

      ruleEngine.handle(event);

      hourlyStatHandler.process
        .calledOnce.should.be.true;
      hourlyStatHandler.process
        .calledWith({
          timestamp: '2017-08-27T07:56:23.642Z',
          gateway: 'test',
          deviceId: '11:11:11:22:22:33',
          power: 123
        });
    });

    it('Should call dailyStatHandler\'s process passing right values', () => {

      const event = {
        GatewayId: 'test',
        Type: 'ENERGY',
        Payload: {
          DeviceId: '11:11:11:22:22:33',
          Yesterday: 0.031,
          Today: 0.013,
          Period: 0,
          Power: 123,
          Factor: 0,
          Voltage: 0,
          Current: 0,
          Time: '2017-08-27T07:56:23.642Z',
          created: new Date(),
        },
      };

      ruleEngine.handle(event);

      dailyStatHandler.process
        .calledOnce.should.be.true;

      dailyStatHandler.process
        .calledWith({
          timestamp: '2017-08-27T07:56:23.642Z',
          gateway: 'test',
          deviceId: '11:11:11:22:22:33',
          dailyconsume: 0.013
        });
    });

    it('Should call updateStatuHandler\'s process passing deviceId', () => {
      const event = {
        GatewayId: 'test',
        Type: 'ENERGY',
        Payload: {
          DeviceId: '11:11:11:22:22:33',
          Yesterday: 0.031,
          Today: 0.013,
          Period: 0,
          Power: 123,
          Factor: 0,
          Voltage: 0,
          Current: 0,
          Time: '2017-08-27T07:56:23.642Z',
          created: new Date(),
        },
      };

      ruleEngine.handle(event);

      updateOnlineStatusHandler.process
        .calledOnce.should.be.true;

      updateOnlineStatusHandler.process
        .calledWith({ deviceId: '11:11:11:22:22:33' });
    });

    it('Should call powerAlerHandler\'s process passing deviceId', () => {
      const event = {
        GatewayId: 'test',
        Type: 'ENERGY',
        Payload: {
          DeviceId: '11:11:11:22:22:33',
          Yesterday: 0.031,
          Today: 0.013,
          Period: 0,
          Power: 123,
          Factor: 0,
          Voltage: 0,
          Current: 0,
          Time: '2017-08-27T07:56:23.642Z',
          created: new Date(),
        },
      };

      ruleEngine.handle(event);

      powerAlertHandler.process
        .calledOnce.should.be.true;

      powerAlertHandler.process
        .calledWith({ deviceId: '11:11:11:22:22:33' });
    });
  });
});
