'use strict';

const transformGateway = (gateway) => {
	return {
		code: gateway.code,
		description: gateway.description
	}
};

export { transformGateway };