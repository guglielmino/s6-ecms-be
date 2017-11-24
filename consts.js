/**
 * Message types to whom identify a message as a event to be stored
 * EVENT_TYPES are for messages coming from devices
 */
export const EVENT_TYPE_ENERGY = 'ENERGY';
export const EVENT_TYPE_INFO = 'INFO';
export const EVENT_POWER_STATUS = 'POWER_STATUS';
export const EVENT_TYPE_LWT = 'LWT';

export const EVENT_TYPE_FRESNEL_INFO = 'FRESNEL_INFO';
export const EVENT_TPE_FRESNEL_POWER_CONSUME = 'FRESNEL_POWER_CONSUME';
export const EVENT_TYPE_FRESNEL_POWER_FEEDBACK = 'FRESNEL_POWER_FEEDBACK';

export const EVENTS_TYPES =
  [EVENT_TYPE_ENERGY, EVENT_TYPE_INFO, EVENT_POWER_STATUS, EVENT_TYPE_LWT];

export const PUBNUB_EVENTS_CHANNEL = 'events';

/**
 * Message types for messages coming from inside the application
 * or client SPA (API call, events, ...)
 */
export const APPEVENT_TYPE_POWER = 'AE_POWER_STATE';
export const APPEVENT_TYPE_POWER_ALERT = 'AE_POWER_ALERT';
export const APPEVENT_TYPE_UNKNOWN = 'AE_UNKNOWN';
export const APPEVENT_TYPE_FIRMWARE = 'AE_FIRMWARE_UPDATE';
export const APPEVENT_TYPE_LWT_ALERT = 'AE_LWT_ALERT';

export const PAGING_MAX_PAGE_SIZE = 100;
