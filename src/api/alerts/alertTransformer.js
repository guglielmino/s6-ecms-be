'use strict';

const transformAlert = (alert)  => {
	console.log(`ev ${JSON.stringify(alert)}`);

	return {
		gateway: alert.gateway,
		date: alert.date,
		deviceId: alert.deviceId,
		message: alert.message,
		read: alert.read
	}
};

export { transformAlert };