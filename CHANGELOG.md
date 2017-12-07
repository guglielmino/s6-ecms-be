<a name="2.8.0"></a>
# [2.8.0](https://gitlab.com/smart-office-iot/iot-project-server/compare/v2.7.1...v2.8.0) (2017-12-07)



<a name="2.7.1"></a>
## [2.7.1](https://gitlab.com/smart-office-iot/iot-project-server/compare/v2.6.1...v2.7.1) (2017-12-01)


### Bug Fixes

* Fix device value endpoint to return hourly data ([31e6e4b](https://gitlab.com/smart-office-iot/iot-project-server/commit/31e6e4b))
* Fix s6f consume mapper ([8e0e2de](https://gitlab.com/smart-office-iot/iot-project-server/commit/8e0e2de))


### Features

* Add api to unread alert and add level field in search query ([0fe57aa](https://gitlab.com/smart-office-iot/iot-project-server/commit/0fe57aa))
* Add lwt handler for LWT messages from s6 fresnel devices ([3d419bf](https://gitlab.com/smart-office-iot/iot-project-server/commit/3d419bf))
* Store measurement from S6 fresnel devices in devicevalues table ([90205a0](https://gitlab.com/smart-office-iot/iot-project-server/commit/90205a0))



<a name="2.6.1"></a>
## [2.6.1](https://gitlab.com/smart-office-iot/iot-project-server/compare/v2.6.0...v2.6.1) (2017-11-27)



<a name="2.6.0"></a>
# [2.6.0](https://gitlab.com/smart-office-iot/iot-project-server/compare/v2.5.1...v2.6.0) (2017-11-24)


### Bug Fixes

* Change package to export data to csv ([952ad4e](https://gitlab.com/smart-office-iot/iot-project-server/commit/952ad4e))
* Fix get daily stats for a given deviceId and date ([ab62e58](https://gitlab.com/smart-office-iot/iot-project-server/commit/ab62e58))
* Removing gatewayAuthorization middleware in API to get device events ([8352879](https://gitlab.com/smart-office-iot/iot-project-server/commit/8352879))


### Features

* Add api to get last event of specified device ([4c5c068](https://gitlab.com/smart-office-iot/iot-project-server/commit/4c5c068))
* Add authentication to email API ([3662347](https://gitlab.com/smart-office-iot/iot-project-server/commit/3662347))
* Add folder with email templates ([19dfbb5](https://gitlab.com/smart-office-iot/iot-project-server/commit/19dfbb5))
* Add location field to device mapping ([fb43d37](https://gitlab.com/smart-office-iot/iot-project-server/commit/fb43d37))
* Add middleware to handle pagination parameters and result ([918584f](https://gitlab.com/smart-office-iot/iot-project-server/commit/918584f))
* Add search in message field of alert document ([97f4632](https://gitlab.com/smart-office-iot/iot-project-server/commit/97f4632))
* Add support for query string search parameters in alerts api ([76c8bdb](https://gitlab.com/smart-office-iot/iot-project-server/commit/76c8bdb))
* Change alerts api to get paged result ([170ab08](https://gitlab.com/smart-office-iot/iot-project-server/commit/170ab08))



<a name="2.5.1"></a>
## [2.5.1](https://gitlab.com/smart-office-iot/iot-project-server/compare/v2.4.3...v2.5.1) (2017-10-19)


### Bug Fixes

* Fix daily and power mapper ([10e0d22](https://gitlab.com/smart-office-iot/iot-project-server/commit/10e0d22))
* Fix eslint error ([8e1f3c2](https://gitlab.com/smart-office-iot/iot-project-server/commit/8e1f3c2))


### Features

* Add alert creation for device online / offline based on LWT message ([26fee6a](https://gitlab.com/smart-office-iot/iot-project-server/commit/26fee6a))
* Add package to send email from api endpoint ([accc705](https://gitlab.com/smart-office-iot/iot-project-server/commit/accc705))
* Change calculation of daily consume ([872de64](https://gitlab.com/smart-office-iot/iot-project-server/commit/872de64))
* Handle tags field in device table ([e19583a](https://gitlab.com/smart-office-iot/iot-project-server/commit/e19583a))



<a name="2.4.3"></a>
## [2.4.3](https://gitlab.com/smart-office-iot/iot-project-server/compare/v2.4.1...v2.4.3) (2017-10-05)


### Bug Fixes

* Fix date in daily provider ([5f3482c](https://gitlab.com/smart-office-iot/iot-project-server/commit/5f3482c))


### Features

* Modify hourly provider behaviour to return full date instead of hour ([700243d](https://gitlab.com/smart-office-iot/iot-project-server/commit/700243d))



<a name="2.4.1"></a>
## [2.4.1](https://gitlab.com/smart-office-iot/iot-project-server/compare/v2.4.0...v2.4.1) (2017-10-04)


### Bug Fixes

* Fix get date in daily stats ([577ceb8](https://gitlab.com/smart-office-iot/iot-project-server/commit/577ceb8))



<a name="2.4.0"></a>
# [2.4.0](https://gitlab.com/smart-office-iot/iot-project-server/compare/v2.3.0...v2.4.0) (2017-10-03)


### Bug Fixes

* Fix provider passed to lwt handler in ruleEngineBootstrap ([c31eef8](https://gitlab.com/smart-office-iot/iot-project-server/commit/c31eef8))


### Features

* Add limit to device query ([9d50d46](https://gitlab.com/smart-office-iot/iot-project-server/commit/9d50d46))



<a name="2.3.0"></a>
# [2.3.0](https://gitlab.com/smart-office-iot/iot-project-server/compare/5b035de...v2.3.0) (2017-09-20)


### Bug Fixes

* Add log for device null in energy processor ([25ec4ef](https://gitlab.com/smart-office-iot/iot-project-server/commit/25ec4ef))
* Fix bootstrap for S6 Fresnel power consume rules ([930f029](https://gitlab.com/smart-office-iot/iot-project-server/commit/930f029))
* Fix bug in bootstrap rule engine ([5f89661](https://gitlab.com/smart-office-iot/iot-project-server/commit/5f89661))
* Fix device command handling after paylod change ([9b4610c](https://gitlab.com/smart-office-iot/iot-project-server/commit/9b4610c))
* Fix device status update in lwtProcessor and powerFeedbackProcessor ([e9261ab](https://gitlab.com/smart-office-iot/iot-project-server/commit/e9261ab))
* Fix duplicate logging for unknow messages ([50c6609](https://gitlab.com/smart-office-iot/iot-project-server/commit/50c6609))
* Fix energy alert ([6f6de6b](https://gitlab.com/smart-office-iot/iot-project-server/commit/6f6de6b))
* Fix event API read feedback ([c89fffc](https://gitlab.com/smart-office-iot/iot-project-server/commit/c89fffc))
* Fix get alert in update read status endpoint ([612d7ba](https://gitlab.com/smart-office-iot/iot-project-server/commit/612d7ba))
* Fix get of nonexistent device and read of device id from path ([07c7f16](https://gitlab.com/smart-office-iot/iot-project-server/commit/07c7f16))
* Fix modify of an existing device for Info1 event ([87a21d1](https://gitlab.com/smart-office-iot/iot-project-server/commit/87a21d1))
* Fix package version ([727e893](https://gitlab.com/smart-office-iot/iot-project-server/commit/727e893))
* Fix package versione ([c6e3d75](https://gitlab.com/smart-office-iot/iot-project-server/commit/c6e3d75))
* Fix payload change for power command ([a9771d6](https://gitlab.com/smart-office-iot/iot-project-server/commit/a9771d6))
* Fix processing command to update firmware ([26cb35e](https://gitlab.com/smart-office-iot/iot-project-server/commit/26cb35e))
* Fix wrong command constant for power event in rule engine and add log in energy processor for d ([2b2cfe0](https://gitlab.com/smart-office-iot/iot-project-server/commit/2b2cfe0))
* Fix wrong use of passed gateway code in /api/gateways/{code} ([6b1ee81](https://gitlab.com/smart-office-iot/iot-project-server/commit/6b1ee81))
* package version ([ee8b1aa](https://gitlab.com/smart-office-iot/iot-project-server/commit/ee8b1aa))
* using npm version to correctly set version of package.json ([50f8b40](https://gitlab.com/smart-office-iot/iot-project-server/commit/50f8b40))


### Features

* Add alert builder to manage alert objects creation ([2f591d2](https://gitlab.com/smart-office-iot/iot-project-server/commit/2f591d2))
* Add alert on power status change failure ([1f361a7](https://gitlab.com/smart-office-iot/iot-project-server/commit/1f361a7))
* Add authKey field in gateways exposed from api ([2ad286c](https://gitlab.com/smart-office-iot/iot-project-server/commit/2ad286c))
* Add content negotiation middleware to serialize API response based on Accept header value ([a73fea0](https://gitlab.com/smart-office-iot/iot-project-server/commit/a73fea0))
* Add createIndex to DataProvider to encapsulate index creation ([b38cffe](https://gitlab.com/smart-office-iot/iot-project-server/commit/b38cffe))
* Add delete alert endpoint ([9ff9228](https://gitlab.com/smart-office-iot/iot-project-server/commit/9ff9228))
* Add device commands endpoint ([297aa8c](https://gitlab.com/smart-office-iot/iot-project-server/commit/297aa8c))
* Add device name in get hourly stats ([e5bd2a3](https://gitlab.com/smart-office-iot/iot-project-server/commit/e5bd2a3))
* Add endpoint to get single device data ([e416b35](https://gitlab.com/smart-office-iot/iot-project-server/commit/e416b35))
* Add endpoint to mark alert read/unread ([8331828](https://gitlab.com/smart-office-iot/iot-project-server/commit/8331828))
* Add endpoint to retrieve hour consume for single device ([7ae94e6](https://gitlab.com/smart-office-iot/iot-project-server/commit/7ae94e6))
* Add energy alerts (power == 0 when device is on) aggregation for same device/gateway in given ([7c4e7f0](https://gitlab.com/smart-office-iot/iot-project-server/commit/7c4e7f0))
* Add enpoint to modify gateway description ([5bb1ad2](https://gitlab.com/smart-office-iot/iot-project-server/commit/5bb1ad2))
* Add gateway auth logic (based on authToken field in Gateways collection) ([0252395](https://gitlab.com/smart-office-iot/iot-project-server/commit/0252395))
* Add gateway field to device DTO ([32a2397](https://gitlab.com/smart-office-iot/iot-project-server/commit/32a2397))
* Add id to api response ([4665b38](https://gitlab.com/smart-office-iot/iot-project-server/commit/4665b38))
* Add level to alerts and expose it in API responses ([00c76e4](https://gitlab.com/smart-office-iot/iot-project-server/commit/00c76e4))
* Add logging of unknown events ([acdfd4c](https://gitlab.com/smart-office-iot/iot-project-server/commit/acdfd4c))
* Add middleware for gateway post validation, NOTE: at this moment the validation function is fa ([11d03ef](https://gitlab.com/smart-office-iot/iot-project-server/commit/11d03ef))
* Add Power Action feedback alert infrastructure ([b70ca42](https://gitlab.com/smart-office-iot/iot-project-server/commit/b70ca42))
* Add processor to handle LWT event ([a009cfd](https://gitlab.com/smart-office-iot/iot-project-server/commit/a009cfd))
* Add S6 Fresnel module info message handling ([7144c64](https://gitlab.com/smart-office-iot/iot-project-server/commit/7144c64))
* Add S6 Fresnel power feedback message handling ([091be6d](https://gitlab.com/smart-office-iot/iot-project-server/commit/091be6d))
* Add S6 Fresnel power message handler ([8d63fc3](https://gitlab.com/smart-office-iot/iot-project-server/commit/8d63fc3))
* Add socketio timeout authentication in config ([5b035de](https://gitlab.com/smart-office-iot/iot-project-server/commit/5b035de))
* Add update of device online status on Energy message receiving ([ba444ac](https://gitlab.com/smart-office-iot/iot-project-server/commit/ba444ac))
* Alerts provider refactoring to decrease code duplication ([4292dad](https://gitlab.com/smart-office-iot/iot-project-server/commit/4292dad))
* Change endpoint for device commands ([b3bc564](https://gitlab.com/smart-office-iot/iot-project-server/commit/b3bc564))
* Device command to update firmware ([17533b8](https://gitlab.com/smart-office-iot/iot-project-server/commit/17533b8))
* Devices provider refactoring to decrease code duplication ([de4f749](https://gitlab.com/smart-office-iot/iot-project-server/commit/de4f749))
* Events provider refactoring to decrease code duplication ([5dbce28](https://gitlab.com/smart-office-iot/iot-project-server/commit/5dbce28))
* Export excel for daily statics ([d6b1d11](https://gitlab.com/smart-office-iot/iot-project-server/commit/d6b1d11))
* Export excel for hourly statistics ([4281b11](https://gitlab.com/smart-office-iot/iot-project-server/commit/4281b11))
* Gateway provider refactoring to reduce code duplication ([b7128b1](https://gitlab.com/smart-office-iot/iot-project-server/commit/b7128b1))
* Order data for export excel ([029b772](https://gitlab.com/smart-office-iot/iot-project-server/commit/029b772))
* Oredr data for export excel ([73e81f3](https://gitlab.com/smart-office-iot/iot-project-server/commit/73e81f3))
* Remove gateway field in excel export for daily stats ([d6bdbfd](https://gitlab.com/smart-office-iot/iot-project-server/commit/d6bdbfd))
* Stats provider refactoring to decrease code duplication ([b0c6f5b](https://gitlab.com/smart-office-iot/iot-project-server/commit/b0c6f5b))



