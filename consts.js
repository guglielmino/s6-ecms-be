/**
 * Message types to whom identify a message as a event to be stored
 * EVENT_TYPES are for messages coming from devices
 */
export const EVENT_TYPE_ENERGY = 'ENERGY';
export const EVENT_TYPE_INFO = 'INFO';
export const EVENT_POWER_STATUS = 'POWER_STATUS';
export const EVENT_TYPE_LWT = 'LWT';

export const EVENT_TYPE_FRESNEL_INFO = 'FRESNEL_INFO';
export const EVENT_TYPE_FRESNEL_POWER_FEEDBACK = 'FRESNEL_POWER_FEEDBACK';
export const EVENT_TYPE_FRESNEL_POWER_CONSUME = 'FRESNEL_POWER_CONSUME';
export const EVENT_TYPE_FRESNEL_REACTIVE_POWER_CONSUME = 'FRESNEL_REACTIVE_POWER_CONSUME';
export const EVENT_TYPE_FRESNEL_DAILY_CONSUME = 'FRESNEL_DAILY_CONSUME';
export const EVENT_TYPE_FRESNEL_CURRENT_CONSUME = 'FRESNEL_CURRENT_CONSUME';
export const EVENT_TYPE_FRESNEL_FREQUENCY = 'FRESNEL_FREQUENCY';
export const EVENT_TYPE_FRESNEL_POWER_FACTOR = 'FRESNEL_POWER_FACTOR';
export const EVENT_TYPE_FRESNEL_VOLTAGE = 'FRESNEL_VOLTAGE';
export const EVENT_TYPE_FRESNEL_LWT = 'FRESNEL_LWT';

// Type from topic consts

export const EVENT_TYPE_TOPIC_INFO = 'events_info';
export const EVENT_TYPE_TOPIC_POWER_FEEDBACK = 'events_power';
export const EVENT_TYPE_TOPIC_POWER_CONSUME = 'sensors_power';
export const EVENT_TYPE_TOPIC_VOLTAGE = 'sensors_voltage';
export const EVENT_TYPE_TOPIC_POWER_FACTOR = 'sensors_powerfactor';
export const EVENT_TYPE_TOPIC_FREQUENCY = 'sensors_frequency';
export const EVENT_TYPE_TOPIC_CURRENT_CONSUME = 'sensors_current';
export const EVENT_TYPE_TOPIC_REACTIVE_POWER_CONSUME = 'sensors_reactivepower';
export const EVENT_TYPE_TOPIC_DAILY_CONSUME = 'sensors_dailyKwh';
export const EVENT_TYPE_TOPIC_LWT = 'events_lwt';
export const EVENT_TYPE_TOPIC_CRONTAB = 'events_crontab';


// List of events allowed from PubNub (
export const EVENTS_TYPES =
  [EVENT_TYPE_ENERGY,
    EVENT_TYPE_INFO,
    EVENT_TYPE_TOPIC_INFO,
    EVENT_POWER_STATUS,
    EVENT_TYPE_LWT,
    EVENT_TYPE_FRESNEL_POWER_FEEDBACK,
    EVENT_TYPE_TOPIC_POWER_FEEDBACK];

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
