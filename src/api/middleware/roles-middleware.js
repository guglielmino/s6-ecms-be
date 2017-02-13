'use strict';

import * as _ from 'lodash';

export default  roles => (req, res, next) => {
    if (roles && req.user) {
        const result = _.intersection(req.user.app_metadata.roles, roles).length > 0;
        if(!result) {
            res.sendStatus(401);
            next(new Error("Unauthorized"));
        }
    }
    
    next();
}