/**
 * Message types to whom identify a message as a event to be stored
 * EVENT_TYPES are for messages coming from devices
 */
export const EVENT_TYPE_ENERGY = 'ENERGY';
export const EVENT_TYPE_INFO = 'INFO';
export const EVENT_POWER_STATUS = 'POWER_STATUS';
export const EVENTS_TYPES = [EVENT_TYPE_ENERGY, EVENT_TYPE_INFO, EVENT_POWER_STATUS];

export const PUBNUB_EVENTS_CHANNEL = 'events';

/**
 * Message types for messages coming from inside the application
 * or client SPA (API call, events, ...)
 */
export const APPEVENT_TYPE_POWER = 'AE_POWER_STATE';
export const APPEVENT_TYPE_POWER_ALERT = 'AE_POWER_ALERT';
export const APPEVENT_TYPE_UNKNOWN = 'AE_UNKNOWN';
