import config from '../config';
import JwtCheck from './middleware/auth-check-middleware';
import RoleCheck from './middleware/roles-middleware';          // eslint-disable-line no-unused-vars
import GatewayAuth from './middleware/gateway-auth-middleware';

import Events from './controllers/events';
import HourlyStats from './controllers/stats/hourly';
import DailyStats from './controllers/stats/daily';
import Gateways from './controllers/gateways';
import Devices from './controllers/devices';
import Alerts from './controllers/alerts';


module.exports = (app, providers) => {
  const AuthCheck = JwtCheck(config.auth0);

  const gatewayAuthValidator = (gateway, token) => providers
      .gatewayProvider
      .getGateway(gateway)
      .then((gw) => {
        if (gw && gw.authKey) {
          return Promise.resolve(gw.authKey === token);
        } else {  // eslint-disable-line no-else-return
          return Promise.resolve(false);
        }
      })
      .catch(err => Promise.resolve(false)); // eslint-disable-line no-unused-vars

  Events(app, [GatewayAuth(gatewayAuthValidator)], providers); // eslint-disable-line no-unused-vars
  HourlyStats(app, [AuthCheck()], providers);
  DailyStats(app, [AuthCheck()], providers);
  Gateways(app, [AuthCheck()], providers);
  Devices(app, [AuthCheck()], providers);
  Alerts(app, [AuthCheck()], providers);
};
