'use strict';

/**
 * Fill user data in request object to simulate action of
 * real JWT Auth middleware
 *
 * @param FakeAuthMiddleware
 * @returns {function(): function(*, *, *)}
 * @constructor
 */
const FakeAuthMiddleware = (userGateways) => {

	return () => (req, res, next) => {
		req.user = {
			app_metadata: {
				gateways: userGateways
			}
		};

		next();
	};
};

export { FakeAuthMiddleware };