import sinon from 'sinon';

import chai from 'chai';

import EventsRuleEngine from '../../services/eventsRuleEngine';

import UpdateOnlineStatusHandler from '../../events/handlers/device/common/onlineStatus/updateOnlineStatusHandler';
import HourlyStatHandler from '../../events/handlers/device/common/powerconsumption/hourlyStatHandler';
import DailyStatHandler from '../../events/handlers/device/common/powerconsumption/dailyStatHandler';
import PowerAlertHandler from '../../events/handlers/device/common/alerts/powerAlertHandler';
import CloseAlertHandler from '../../events/handlers/device/common/alerts/closeAlertHandler';

import PowerConsumptionRules from './powerConsumption';
import { types } from '../../common/alertConsts';

chai.should();
const expect = chai.expect();

describe('Power Consumption rules', () => {
  let ruleEngine;
  let hourlyStatHandler;
  let dailyStatHandler;
  let updateOnlineStatusHandler;
  let powerAlertHandler;
  let closeAlertHandler;

  beforeEach(() => {
    hourlyStatHandler = HourlyStatHandler();
    dailyStatHandler = DailyStatHandler();
    updateOnlineStatusHandler = UpdateOnlineStatusHandler();
    powerAlertHandler = PowerAlertHandler();
    closeAlertHandler = CloseAlertHandler();

    sinon.stub(hourlyStatHandler);
    sinon.stub(dailyStatHandler);
    sinon.stub(updateOnlineStatusHandler);
    sinon.stub(powerAlertHandler);
    sinon.stub(closeAlertHandler);

    ruleEngine = new EventsRuleEngine();
    PowerConsumptionRules(ruleEngine, {
      hourlyStatHandler,
      dailyStatHandler,
      updateOnlineStatusHandler,
      powerAlertHandler,
      closeAlertHandler,
    });
  });

  context('S6 Fresnel device', () => {
    it('Should call hourlyStatHandler\'s process passing right values', () => {
      const event =
        {
          GatewayId: 'CASAFG',
          Type: 'FRESNEL_POWER_CONSUME',
          Payload: {
            GatewayId: 'VG59',
            deviceId: '00:11:22:33:44:55',
            timestamp: '2017-08-27T07:56:23.642Z',
            value: 23.2,
          },
        };

      ruleEngine.handle(event);

      hourlyStatHandler.process
        .calledOnce.should.be.true;
      hourlyStatHandler.process
        .calledWith({
          GatewayId: 'VG59',
          deviceId: '00:11:22:33:44:55',
          timestamp: '2017-08-27T07:56:23.642Z',
          value: 23.2,
        });
    });

    it('Should call updateStatuHandler\'s process passing deviceId', () => {
      const event =
        {
          GatewayId: 'CASAFG',
          Type: 'FRESNEL_POWER_CONSUME',
          Payload: {
            GatewayId: 'VG59',
            deviceId: '00:11:22:33:44:55',
            timestamp: '2017-08-27T07:56:23.642Z',
            value: 23.2
          },
        };

      ruleEngine.handle(event);

      updateOnlineStatusHandler.process
        .calledOnce.should.be.true;
      updateOnlineStatusHandler.process
        .calledWith({ deviceId: '00:11:22:33:44:55' });
    });

    it('Should call powerAlertHandler\'s process passing deviceId if power < 0.1', () => {
      const event =
        {
          GatewayId: 'CASAFG',
          Type: 'FRESNEL_POWER_CONSUME',
          Payload: {
            GatewayId: 'VG59',
            deviceId: '00:11:22:33:44:55',
            timestamp: '2017-08-27T07:56:23.642Z',
            value: 0.0,
          },
        };

      ruleEngine.handle(event);

      powerAlertHandler.process
        .calledOnce.should.be.true;
      powerAlertHandler.process
        .calledWith(sinon.match({ deviceId: '00:11:22:33:44:55' })).should.be.true;
    });

    it('Should NOT call powerAlertHandler\'s process passing deviceId if power > 0.1', () => {
      const event =
        {
          GatewayId: 'CASAFG',
          Type: 'FRESNEL_POWER_CONSUME',
          Payload: {
            GatewayId: 'VG59',
            deviceId: '00:11:22:33:44:55',
            timestamp: '2017-08-27T07:56:23.642Z',
            value: 2,
          },
        };

      ruleEngine.handle(event);

      powerAlertHandler.process
        .calledOnce.should.be.false;
    });

    it('Should call closeAlertHandler process if power is >= 0.1', () => {
      const event =
        {
          GatewayId: 'CASAFG',
          Type: 'FRESNEL_POWER_CONSUME',
          Payload: {
            GatewayId: 'VG59',
            deviceId: '00:11:22:33:44:55',
            timestamp: '2017-08-27T07:56:23.642Z',
            value: 2,
          },
        };

      ruleEngine.handle(event);

      closeAlertHandler.process
        .calledOnce.should.be.true;
      closeAlertHandler.process
        .calledWith(sinon.match({ deviceId: '00:11:22:33:44:55', type: types.ALERT_TYPE_DEVICE_BROKEN })).should.be.true;
    });

    it('Should NOT call closeAlertHandler process if power is < 0.1', () => {
      const event =
        {
          GatewayId: 'CASAFG',
          Type: 'FRESNEL_POWER_CONSUME',
          Payload: {
            GatewayId: 'VG59',
            deviceId: '00:11:22:33:44:55',
            timestamp: '2017-08-27T07:56:23.642Z',
            value: 0.05,
          },
        };

      ruleEngine.handle(event);

      closeAlertHandler.process
        .calledOnce.should.be.false;
    });
  });

  context('S6 Fresnel device with Type from Topic', () => {
    it('Should call hourlyStatHandler\'s process passing right values', () => {
      const event =
        {
          GatewayId: 'CASAFG',
          Type: 'sensors_power',
          Payload: {
            GatewayId: 'VG59',
            deviceId: '00:11:22:33:44:55',
            timestamp: '2017-08-27T07:56:23.642Z',
            value: 23.2,
          },
        };

      ruleEngine.handle(event);

      hourlyStatHandler.process
        .calledOnce.should.be.true;
      hourlyStatHandler.process
        .calledWith({
          GatewayId: 'VG59',
          deviceId: '00:11:22:33:44:55',
          timestamp: '2017-08-27T07:56:23.642Z',
          value: 23.2,
        });
    });

    it('Should call updateStatuHandler\'s process passing deviceId', () => {
      const event =
        {
          GatewayId: 'CASAFG',
          Type: 'sensors_power',
          Payload: {
            GatewayId: 'VG59',
            deviceId: '00:11:22:33:44:55',
            timestamp: '2017-08-27T07:56:23.642Z',
            value: 23.2
          },
        };

      ruleEngine.handle(event);

      updateOnlineStatusHandler.process
        .calledOnce.should.be.true;
      updateOnlineStatusHandler.process
        .calledWith({ deviceId: '00:11:22:33:44:55' });
    });

    it('Should call powerAlertHandler\'s process passing deviceId if power < 0.1', () => {
      const event =
        {
          GatewayId: 'CASAFG',
          Type: 'sensors_power',
          Payload: {
            GatewayId: 'VG59',
            deviceId: '00:11:22:33:44:55',
            timestamp: '2017-08-27T07:56:23.642Z',
            value: 0.0,
          },
        };

      ruleEngine.handle(event);

      powerAlertHandler.process
        .calledOnce.should.be.true;
      powerAlertHandler.process
        .calledWith(sinon.match({ deviceId: '00:11:22:33:44:55' })).should.be.true;
    });

    it('Should NOT call powerAlertHandler\'s process passing deviceId if power > 0.1', () => {
      const event =
        {
          GatewayId: 'CASAFG',
          Type: 'sensors_power',
          Payload: {
            GatewayId: 'VG59',
            deviceId: '00:11:22:33:44:55',
            timestamp: '2017-08-27T07:56:23.642Z',
            value: 2,
          },
        };

      ruleEngine.handle(event);

      powerAlertHandler.process
        .calledOnce.should.be.false;
    });

    it('Should call closeAlertHandler process if power is >= 0.1', () => {
      const event =
        {
          GatewayId: 'CASAFG',
          Type: 'sensors_power',
          Payload: {
            GatewayId: 'VG59',
            deviceId: '00:11:22:33:44:55',
            timestamp: '2017-08-27T07:56:23.642Z',
            value: 2,
          },
        };

      ruleEngine.handle(event);

      closeAlertHandler.process
        .calledOnce.should.be.true;
      closeAlertHandler.process
        .calledWith(sinon.match({ deviceId: '00:11:22:33:44:55', type: types.ALERT_TYPE_DEVICE_BROKEN })).should.be.true;
    });

    it('Should NOT call closeAlertHandler process if power is < 0.1', () => {
      const event =
        {
          GatewayId: 'CASAFG',
          Type: 'sensors_power',
          Payload: {
            GatewayId: 'VG59',
            deviceId: '00:11:22:33:44:55',
            timestamp: '2017-08-27T07:56:23.642Z',
            value: 0.05,
          },
        };

      ruleEngine.handle(event);

      closeAlertHandler.process
        .calledOnce.should.be.false;
    });
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
