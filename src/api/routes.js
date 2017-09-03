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

  // NOTE: The validation function is fake for the moment,
  //       it should be validate, on the persistence layer, the pair gw,token
  Events(app, [GatewayAuth((gw, token) => true)], providers); // eslint-disable-line no-unused-vars
  HourlyStats(app, [AuthCheck()], providers);
  DailyStats(app, [AuthCheck()], providers);
  Gateways(app, [AuthCheck()], providers);
  Devices(app, [AuthCheck()], providers);
  Alerts(app, [AuthCheck()], providers);
};
