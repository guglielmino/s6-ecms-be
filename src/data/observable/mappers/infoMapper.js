'use strict';

function commandPerDevice(appName, topic) {
	let ret = [];

	switch(appName) {
		case SONOFF_POW:
			ret.push({
				power: `mqtt:${topic}/POWER`
			});
			break;
	}

	return ret;
}


export default function infoMapper(e) {
	return {
		Type: e.Type,
		Payload: {
			gateway: e.GatewayId,
			topic: e.Payload.Topic,
			deviceType: e.Payload.AppName,
			deviceId: e.Payload.DeviceId || '00:00:00:00:00:00',
			commands: commandPerDevice(e.Payload.AppName, e.Payload.Topic)
		}
	};
}

// AppName values set in firmware
const SONOFF 					= 'Sonoff 8266 Module';			// Sonoff Basic, Sonoff RF, Sonoff SV, Sonoff Dual, Sonoff TH, S20 Smart Socket
const SONOFF_POW 			=	'Sonoff Pow Module';      // Sonoff Pow
const SONOFF_2 				=	'Sonoff 8285 Module';     // Sonoff Touch, Sonoff 4CH
const MOTOR_CAC				=	'Motor C/AC Module';      // iTead Motor Clockwise/Anticlockwise
const ELECTRO_DRAGON  =	'ElectroDragon Module';		// Electro Dragon Wifi IoT Relay Board Based on ESP8266

export { SONOFF, SONOFF_POW, SONOFF_2, MOTOR_CAC, ELECTRO_DRAGON };
