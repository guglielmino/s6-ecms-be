import * as _ from 'lodash';

export default roles => (req, res, next) => {
  if (roles && req.user) {
    const appMetadata = req.user['https://ecms.smartsix.it/app_metadata'];
    const result = _.intersection(appMetadata.roles, roles).length > 0;
    if (!result) {
      res.sendStatus(401);
      next(new Error('Unauthorized'));
    }
  }
  next();
};
