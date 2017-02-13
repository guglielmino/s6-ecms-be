'use strict';

const transformDevice = (device) => {
	return {
		name: device.name,
		deviceId: device.deviceId
	}
};

export { transformDevice };