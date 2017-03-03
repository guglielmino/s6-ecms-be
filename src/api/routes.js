import config from '../config';
import JwtCheck from './middleware/auth-check-middleware';
import RoleCheck from './middleware/roles-middleware';

import Events from './events';
import Stats from './stats';
import HourlyStats from './stats/hourly';
import Gateways from './gateways';
import Devices from './devices';
import Alerts from './alerts';

module.exports = (app, providers) => {
  const AuthCheck = JwtCheck(config.auth0);

  Events(app, AuthCheck, RoleCheck, providers);
  Stats(app, AuthCheck, RoleCheck, providers);
  HourlyStats(app, AuthCheck, RoleCheck, providers);
  Gateways(app, AuthCheck, RoleCheck, providers);
  Devices(app, AuthCheck, RoleCheck, providers);
  Alerts(app, AuthCheck, RoleCheck, providers);
};
