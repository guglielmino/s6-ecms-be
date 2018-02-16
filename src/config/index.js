require('dotenv').config();


[
  'NODE_ENV',
  'PUBNUB_PKEY',
  'PUBNUB_SKEY',
  'SENTRY_DSN',
  'MONGO_URI',
  'AUTH0_SECRET',
  'AUTH0_CLIENTID',
  'AUTH0_DOMAIN',
  'REDIS_HOST',
  'REDIS_PORT',
].forEach((name) => {
  if (!process.env[name]) {
    throw new Error(`Environment variable ${name} is missing`);
  }
});

const config = {
  env: process.env.NODE_ENV,
  logger: {
    level: process.env.LOG_LEVEL || 'debug',
    path: process.env.LOG_PATH || `${__dirname}/../logs/app.log`,
    enabled: process.env.LOG_ENABLED ? process.env.LOG_ENABLED.toLowerCase() === 'true' : false,
    sentry: {
      enabled: process.env.SENTRY_ENABLED ? process.env.SENTRY_ENABLED.toLowerCase() === 'true' : false,
      dsn: process.env.SENTRY_DSN,
    },
  },
  server: {
    host: process.env.HOST || '0.0.0.0',
    port: Number(process.env.PORT || 8090),
  },
  pubnub: {
    publishKey: process.env.PUBNUB_PKEY,
    subscribeKey: process.env.PUBNUB_SKEY,
  },
  mongo: {
    uri: process.env.MONGO_URI,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  auth0: {
    secret: process.env.AUTH0_SECRET,
    clientID: process.env.AUTH0_CLIENTID,
    domain: process.env.AUTH0_DOMAIN,
    timeout: process.env.AUTH0_TIMEOUT || 15000,
  },
  email: {
    from: process.env.DEFAULT_FROM || 'info@smartsix.it',
    language: process.env.DEFAULT_LANGUAGE || 'en',
    transport: process.env.TRANSPORT || 'ses',
    templatesDir: process.env.TEMPLATES_DIR,
    awsRegion: process.env.AWS_REGION,
    awsSecret: process.env.AWS_SECRET,
    awsKey: process.env.AWS_KEY,
  },
  devices: {
    s6fresnelotaurl: process.env.S6FRESNEL_OTA_URL || 'http://0.0.0.0:8000',
  },
};

module.exports = config;
