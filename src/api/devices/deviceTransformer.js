'use strict';

const transformDevice = (device) => {
	return {
		name: device.name,
		deviceId: device.deviceId,
		type: device.deviceType,
		version: device.swVersion
	}
};

export { transformDevice };