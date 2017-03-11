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
 * Message types for messages coming from SPA application
 */
export const APPEVENT_TYPE_POWER = 'POWER_STATE';
