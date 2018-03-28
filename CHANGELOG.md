<a name="3.3.1"></a>
## [3.3.1](https://gitlab.com/SmartSix/s6-ecms-be/compare/v3.3.0...v3.3.1) (2018-03-28)


### Bug Fixes

* Fix power alert handling to manage relay index ([a7db32f](https://gitlab.com/SmartSix/s6-ecms-be/commit/a7db32f))



<a name="3.3.0"></a>
# [3.3.0](https://gitlab.com/SmartSix/s6-ecms-be/compare/v3.2.1...v3.3.0) (2018-03-27)


### Bug Fixes

* Fix PowerFeedbackHandler to manage old format of device's power ([a250518](https://gitlab.com/SmartSix/s6-ecms-be/commit/a250518))
* Fix update power alert with field open:true and read:false ([173b553](https://gitlab.com/SmartSix/s6-ecms-be/commit/173b553))


### Features

* Add feature mapping to device transformer ([a6e97bf](https://gitlab.com/SmartSix/s6-ecms-be/commit/a6e97bf))
* Handling device power feedback with relay index ([0872d51](https://gitlab.com/SmartSix/s6-ecms-be/commit/0872d51))
* Update device info mapper to map feature list to payload ([b0896d8](https://gitlab.com/SmartSix/s6-ecms-be/commit/b0896d8))
* Update powerswitch payload mapper to handle relay index ([c1248d7](https://gitlab.com/SmartSix/s6-ecms-be/commit/c1248d7))



<a name="3.2.1"></a>
## [3.2.1](https://gitlab.com/SmartSix/s6-ecms-be/compare/v3.2.0...v3.2.1) (2018-03-20)



<a name="3.2.0"></a>
# [3.2.0](https://gitlab.com/SmartSix/s6-ecms-be/compare/v3.1.1...v3.2.0) (2018-03-07)


### Bug Fixes

* Reopen Offline alert in lwtStatusAlertHandler ([8b9f37a](https://gitlab.com/SmartSix/s6-ecms-be/commit/8b9f37a))



<a name="3.1.1"></a>
## [3.1.1](https://gitlab.com/SmartSix/s6-ecms-be/compare/v3.0.0...v3.1.1) (2018-02-21)



<a name="3.0.0"></a>
# [3.0.0](https://gitlab.com/SmartSix/s6-ecms-be/compare/v2.16.2...v3.0.0) (2018-02-16)


### Features

* Add transformer to filter fields of auth0 user ([d8c82fb](https://gitlab.com/SmartSix/s6-ecms-be/commit/d8c82fb))
* Connect to redis db used to store user settings ([bad88f6](https://gitlab.com/SmartSix/s6-ecms-be/commit/bad88f6))
* Endpoint to update user based on userId ([44775ec](https://gitlab.com/SmartSix/s6-ecms-be/commit/44775ec))



<a name="2.16.2"></a>
## [2.16.2](https://gitlab.com/SmartSix/s6-ecms-be/compare/v2.16.1...v2.16.2) (2018-02-02)


### Bug Fixes

* Hourly stats report with device description instead of device name ([f3178fe](https://gitlab.com/SmartSix/s6-ecms-be/commit/f3178fe))
* Lwt alert handler update OFFLINE alert if there is a previous alert for same device and gateway ([0f7d1f4](https://gitlab.com/SmartSix/s6-ecms-be/commit/0f7d1f4))
* Renaming location to group in info payload ([06ea3b0](https://gitlab.com/SmartSix/s6-ecms-be/commit/06ea3b0))



<a name="2.16.1"></a>
## [2.16.1](https://gitlab.com/SmartSix/s6-ecms-be/compare/v2.15.0...v2.16.1) (2018-01-29)



<a name="2.15.0"></a>
# [2.15.0](https://gitlab.com/SmartSix/s6-ecms-be/compare/v2.14.0...v2.15.0) (2018-01-29)


### Bug Fixes

* Close alert handler set lastUpdate field in alert document ([a02b556](https://gitlab.com/SmartSix/s6-ecms-be/commit/a02b556))


### Features

* Add endpoints to get and modify device groups ([5d5f0f1](https://gitlab.com/SmartSix/s6-ecms-be/commit/5d5f0f1))
* Add handler to create device groups when info message is received ([c6c1bbb](https://gitlab.com/SmartSix/s6-ecms-be/commit/c6c1bbb))



<a name="2.14.0"></a>
# [2.14.0](https://gitlab.com/SmartSix/s6-ecms-be/compare/v2.13.3...v2.14.0) (2018-01-19)



<a name="2.13.3"></a>
## [2.13.3](https://gitlab.com/SmartSix/s6-ecms-be/compare/v2.13.2...v2.13.3) (2018-01-19)


### Bug Fixes

* Fix close alert handler parameter ([5780eb1](https://gitlab.com/SmartSix/s6-ecms-be/commit/5780eb1))
* Fix device provider name in close alert handler ([1c0b6e7](https://gitlab.com/SmartSix/s6-ecms-be/commit/1c0b6e7))



<a name="2.13.2"></a>
## [2.13.2](https://gitlab.com/SmartSix/s6-ecms-be/compare/v2.13.1...v2.13.2) (2018-01-19)


### Bug Fixes

* Pass close alert handler to power consumption event handler ([2fbf025](https://gitlab.com/SmartSix/s6-ecms-be/commit/2fbf025))



<a name="2.13.1"></a>
## [2.13.1](https://gitlab.com/SmartSix/s6-ecms-be/compare/v2.13.0...v2.13.1) (2018-01-19)



<a name="2.13.0"></a>
# [2.13.0](https://gitlab.com/SmartSix/s6-ecms-be/compare/v2.12.6...v2.13.0) (2018-01-19)


### Bug Fixes

* docker login ([dda9cf1](https://gitlab.com/SmartSix/s6-ecms-be/commit/dda9cf1))
* Fix patch method for devices API ([fb17737](https://gitlab.com/SmartSix/s6-ecms-be/commit/fb17737))


### Features

* Add generic handler to close alert used in power and lwt rules ([05cf970](https://gitlab.com/SmartSix/s6-ecms-be/commit/05cf970))
* Create alert only for Offline LWT messages ([cf87cb1](https://gitlab.com/SmartSix/s6-ecms-be/commit/cf87cb1))
* Introducing alert's types ([417fa92](https://gitlab.com/SmartSix/s6-ecms-be/commit/417fa92))
* Lwt online alert close last offline alert ([31fb4e9](https://gitlab.com/SmartSix/s6-ecms-be/commit/31fb4e9))



<a name="2.12.6"></a>
## [2.12.6](https://gitlab.com/SmartSix/s6-ecms-be/compare/v2.12.5...v2.12.6) (2018-01-11)



<a name="2.12.5"></a>
## [2.12.5](https://gitlab.com/SmartSix/s6-ecms-be/compare/v2.12.4...v2.12.5) (2018-01-11)


### Bug Fixes

* change gitlab-ci.yml file to read known host from secret variable ([3cd7090](https://gitlab.com/SmartSix/s6-ecms-be/commit/3cd7090))



<a name="2.12.4"></a>
## [2.12.4](https://gitlab.com/SmartSix/s6-ecms-be/compare/v2.12.3...v2.12.4) (2018-01-10)


### Bug Fixes

* fix dockerfile to install openssh in container ([f167ee8](https://gitlab.com/SmartSix/s6-ecms-be/commit/f167ee8))



<a name="2.12.3"></a>
## [2.12.3](https://gitlab.com/SmartSix/s6-ecms-be/compare/v2.12.2...v2.12.3) (2018-01-10)


### Bug Fixes

* fix dockerfile to install git in container ([1a93105](https://gitlab.com/SmartSix/s6-ecms-be/commit/1a93105))



<a name="2.12.2"></a>
## [2.12.2](https://gitlab.com/SmartSix/s6-ecms-be/compare/v2.12.1...v2.12.2) (2018-01-10)


### Bug Fixes

* correct gitlab-ci.yml file ([2eb0ccc](https://gitlab.com/SmartSix/s6-ecms-be/commit/2eb0ccc))



<a name="2.12.1"></a>
## [2.12.1](https://gitlab.com/SmartSix/s6-ecms-be/compare/v2.12.0...v2.12.1) (2018-01-10)



<a name="2.12.0"></a>
# [2.12.0](https://gitlab.com/SmartSix/s6-ecms-be/compare/v2.11.0...v2.12.0) (2018-01-10)



<a name="2.11.0"></a>
# [2.11.0](https://gitlab.com/SmartSix/s6-ecms-be/compare/v2.10.0...v2.11.0) (2018-01-09)



<a name="2.10.0"></a>
# [2.10.0](https://gitlab.com/SmartSix/s6-ecms-be/compare/v2.9.0...v2.10.0) (2018-01-09)


### Bug Fixes

* Fix payload as string in firmware update command for S6Fresnel ([2904d2e](https://gitlab.com/SmartSix/s6-ecms-be/commit/2904d2e))



<a name="2.9.0"></a>
# [2.9.0](https://gitlab.com/SmartSix/s6-ecms-be/compare/v2.8.0...v2.9.0) (2017-12-21)


### Bug Fixes

* Genrate alert for broken device with power < 0.1 instead of power = 0 ([2c80c7c](https://gitlab.com/SmartSix/s6-ecms-be/commit/2c80c7c))
* Update device doesn't overwrite description field ([7b5b0bb](https://gitlab.com/SmartSix/s6-ecms-be/commit/7b5b0bb))


### Features

* Add export excel to device values endpoint ([bf64f8a](https://gitlab.com/SmartSix/s6-ecms-be/commit/bf64f8a))



<a name="2.8.0"></a>
# [2.8.0](https://gitlab.com/SmartSix/s6-ecms-be/compare/v2.7.1...v2.8.0) (2017-12-07)



<a name="2.7.1"></a>
## [2.7.1](https://gitlab.com/SmartSix/s6-ecms-be/compare/v2.6.1...v2.7.1) (2017-12-01)


### Bug Fixes

* Fix device value endpoint to return hourly data ([31e6e4b](https://gitlab.com/SmartSix/s6-ecms-be/commit/31e6e4b))
* Fix s6f consume mapper ([8e0e2de](https://gitlab.com/SmartSix/s6-ecms-be/commit/8e0e2de))


### Features

* Add api to unread alert and add level field in search query ([0fe57aa](https://gitlab.com/SmartSix/s6-ecms-be/commit/0fe57aa))
* Add lwt handler for LWT messages from s6 fresnel devices ([3d419bf](https://gitlab.com/SmartSix/s6-ecms-be/commit/3d419bf))
* Store measurement from S6 fresnel devices in devicevalues table ([90205a0](https://gitlab.com/SmartSix/s6-ecms-be/commit/90205a0))



<a name="2.6.1"></a>
## [2.6.1](https://gitlab.com/SmartSix/s6-ecms-be/compare/v2.6.0...v2.6.1) (2017-11-27)



<a name="2.6.0"></a>
# [2.6.0](https://gitlab.com/SmartSix/s6-ecms-be/compare/v2.5.1...v2.6.0) (2017-11-24)


### Bug Fixes

* Change package to export data to csv ([952ad4e](https://gitlab.com/SmartSix/s6-ecms-be/commit/952ad4e))
* Fix get daily stats for a given deviceId and date ([ab62e58](https://gitlab.com/SmartSix/s6-ecms-be/commit/ab62e58))
* Removing gatewayAuthorization middleware in API to get device events ([8352879](https://gitlab.com/SmartSix/s6-ecms-be/commit/8352879))


### Features

* Add api to get last event of specified device ([4c5c068](https://gitlab.com/SmartSix/s6-ecms-be/commit/4c5c068))
* Add authentication to email API ([3662347](https://gitlab.com/SmartSix/s6-ecms-be/commit/3662347))
* Add folder with email templates ([19dfbb5](https://gitlab.com/SmartSix/s6-ecms-be/commit/19dfbb5))
* Add location field to device mapping ([fb43d37](https://gitlab.com/SmartSix/s6-ecms-be/commit/fb43d37))
* Add middleware to handle pagination parameters and result ([918584f](https://gitlab.com/SmartSix/s6-ecms-be/commit/918584f))
* Add search in message field of alert document ([97f4632](https://gitlab.com/SmartSix/s6-ecms-be/commit/97f4632))
* Add support for query string search parameters in alerts api ([76c8bdb](https://gitlab.com/SmartSix/s6-ecms-be/commit/76c8bdb))
* Change alerts api to get paged result ([170ab08](https://gitlab.com/SmartSix/s6-ecms-be/commit/170ab08))



<a name="2.5.1"></a>
## [2.5.1](https://gitlab.com/SmartSix/s6-ecms-be/compare/v2.4.3...v2.5.1) (2017-10-19)


### Bug Fixes

* Fix daily and power mapper ([10e0d22](https://gitlab.com/SmartSix/s6-ecms-be/commit/10e0d22))
* Fix eslint error ([8e1f3c2](https://gitlab.com/SmartSix/s6-ecms-be/commit/8e1f3c2))


### Features

* Add alert creation for device online / offline based on LWT message ([26fee6a](https://gitlab.com/SmartSix/s6-ecms-be/commit/26fee6a))
* Add package to send email from api endpoint ([accc705](https://gitlab.com/SmartSix/s6-ecms-be/commit/accc705))
* Change calculation of daily consume ([872de64](https://gitlab.com/SmartSix/s6-ecms-be/commit/872de64))
* Handle tags field in device table ([e19583a](https://gitlab.com/SmartSix/s6-ecms-be/commit/e19583a))



<a name="2.4.3"></a>
## [2.4.3](https://gitlab.com/SmartSix/s6-ecms-be/compare/v2.4.1...v2.4.3) (2017-10-05)


### Bug Fixes

* Fix date in daily provider ([5f3482c](https://gitlab.com/SmartSix/s6-ecms-be/commit/5f3482c))


### Features

* Modify hourly provider behaviour to return full date instead of hour ([700243d](https://gitlab.com/SmartSix/s6-ecms-be/commit/700243d))



<a name="2.4.1"></a>
## [2.4.1](https://gitlab.com/SmartSix/s6-ecms-be/compare/v2.4.0...v2.4.1) (2017-10-04)


### Bug Fixes

* Fix get date in daily stats ([577ceb8](https://gitlab.com/SmartSix/s6-ecms-be/commit/577ceb8))



<a name="2.4.0"></a>
# [2.4.0](https://gitlab.com/SmartSix/s6-ecms-be/compare/v2.3.0...v2.4.0) (2017-10-03)


### Bug Fixes

* Fix provider passed to lwt handler in ruleEngineBootstrap ([c31eef8](https://gitlab.com/SmartSix/s6-ecms-be/commit/c31eef8))


### Features

* Add limit to device query ([9d50d46](https://gitlab.com/SmartSix/s6-ecms-be/commit/9d50d46))



<a name="2.3.0"></a>
# [2.3.0](https://gitlab.com/SmartSix/s6-ecms-be/compare/5b035de...v2.3.0) (2017-09-20)


### Bug Fixes

* Add log for device null in energy processor ([25ec4ef](https://gitlab.com/SmartSix/s6-ecms-be/commit/25ec4ef))
* Fix bootstrap for S6 Fresnel power consume rules ([930f029](https://gitlab.com/SmartSix/s6-ecms-be/commit/930f029))
* Fix bug in bootstrap rule engine ([5f89661](https://gitlab.com/SmartSix/s6-ecms-be/commit/5f89661))
* Fix device command handling after paylod change ([9b4610c](https://gitlab.com/SmartSix/s6-ecms-be/commit/9b4610c))
* Fix device status update in lwtProcessor and powerFeedbackProcessor ([e9261ab](https://gitlab.com/SmartSix/s6-ecms-be/commit/e9261ab))
* Fix duplicate logging for unknow messages ([50c6609](https://gitlab.com/SmartSix/s6-ecms-be/commit/50c6609))
* Fix energy alert ([6f6de6b](https://gitlab.com/SmartSix/s6-ecms-be/commit/6f6de6b))
* Fix event API read feedback ([c89fffc](https://gitlab.com/SmartSix/s6-ecms-be/commit/c89fffc))
* Fix get alert in update read status endpoint ([612d7ba](https://gitlab.com/SmartSix/s6-ecms-be/commit/612d7ba))
* Fix get of nonexistent device and read of device id from path ([07c7f16](https://gitlab.com/SmartSix/s6-ecms-be/commit/07c7f16))
* Fix modify of an existing device for Info1 event ([87a21d1](https://gitlab.com/SmartSix/s6-ecms-be/commit/87a21d1))
* Fix package version ([727e893](https://gitlab.com/SmartSix/s6-ecms-be/commit/727e893))
* Fix package versione ([c6e3d75](https://gitlab.com/SmartSix/s6-ecms-be/commit/c6e3d75))
* Fix payload change for power command ([a9771d6](https://gitlab.com/SmartSix/s6-ecms-be/commit/a9771d6))
* Fix processing command to update firmware ([26cb35e](https://gitlab.com/SmartSix/s6-ecms-be/commit/26cb35e))
* Fix wrong command constant for power event in rule engine and add log in energy processor for d ([2b2cfe0](https://gitlab.com/SmartSix/s6-ecms-be/commit/2b2cfe0))
* Fix wrong use of passed gateway code in /api/gateways/{code} ([6b1ee81](https://gitlab.com/SmartSix/s6-ecms-be/commit/6b1ee81))
* package version ([ee8b1aa](https://gitlab.com/SmartSix/s6-ecms-be/commit/ee8b1aa))
* using npm version to correctly set version of package.json ([50f8b40](https://gitlab.com/SmartSix/s6-ecms-be/commit/50f8b40))


### Features

* Add alert builder to manage alert objects creation ([2f591d2](https://gitlab.com/SmartSix/s6-ecms-be/commit/2f591d2))
* Add alert on power status change failure ([1f361a7](https://gitlab.com/SmartSix/s6-ecms-be/commit/1f361a7))
* Add authKey field in gateways exposed from api ([2ad286c](https://gitlab.com/SmartSix/s6-ecms-be/commit/2ad286c))
* Add content negotiation middleware to serialize API response based on Accept header value ([a73fea0](https://gitlab.com/SmartSix/s6-ecms-be/commit/a73fea0))
* Add createIndex to DataProvider to encapsulate index creation ([b38cffe](https://gitlab.com/SmartSix/s6-ecms-be/commit/b38cffe))
* Add delete alert endpoint ([9ff9228](https://gitlab.com/SmartSix/s6-ecms-be/commit/9ff9228))
* Add device commands endpoint ([297aa8c](https://gitlab.com/SmartSix/s6-ecms-be/commit/297aa8c))
* Add device name in get hourly stats ([e5bd2a3](https://gitlab.com/SmartSix/s6-ecms-be/commit/e5bd2a3))
* Add endpoint to get single device data ([e416b35](https://gitlab.com/SmartSix/s6-ecms-be/commit/e416b35))
* Add endpoint to mark alert read/unread ([8331828](https://gitlab.com/SmartSix/s6-ecms-be/commit/8331828))
* Add endpoint to retrieve hour consume for single device ([7ae94e6](https://gitlab.com/SmartSix/s6-ecms-be/commit/7ae94e6))
* Add energy alerts (power == 0 when device is on) aggregation for same device/gateway in given ([7c4e7f0](https://gitlab.com/SmartSix/s6-ecms-be/commit/7c4e7f0))
* Add enpoint to modify gateway description ([5bb1ad2](https://gitlab.com/SmartSix/s6-ecms-be/commit/5bb1ad2))
* Add gateway auth logic (based on authToken field in Gateways collection) ([0252395](https://gitlab.com/SmartSix/s6-ecms-be/commit/0252395))
* Add gateway field to device DTO ([32a2397](https://gitlab.com/SmartSix/s6-ecms-be/commit/32a2397))
* Add id to api response ([4665b38](https://gitlab.com/SmartSix/s6-ecms-be/commit/4665b38))
* Add level to alerts and expose it in API responses ([00c76e4](https://gitlab.com/SmartSix/s6-ecms-be/commit/00c76e4))
* Add logging of unknown events ([acdfd4c](https://gitlab.com/SmartSix/s6-ecms-be/commit/acdfd4c))
* Add middleware for gateway post validation, NOTE: at this moment the validation function is fa ([11d03ef](https://gitlab.com/SmartSix/s6-ecms-be/commit/11d03ef))
* Add Power Action feedback alert infrastructure ([b70ca42](https://gitlab.com/SmartSix/s6-ecms-be/commit/b70ca42))
* Add processor to handle LWT event ([a009cfd](https://gitlab.com/SmartSix/s6-ecms-be/commit/a009cfd))
* Add S6 Fresnel module info message handling ([7144c64](https://gitlab.com/SmartSix/s6-ecms-be/commit/7144c64))
* Add S6 Fresnel power feedback message handling ([091be6d](https://gitlab.com/SmartSix/s6-ecms-be/commit/091be6d))
* Add S6 Fresnel power message handler ([8d63fc3](https://gitlab.com/SmartSix/s6-ecms-be/commit/8d63fc3))
* Add socketio timeout authentication in config ([5b035de](https://gitlab.com/SmartSix/s6-ecms-be/commit/5b035de))
* Add update of device online status on Energy message receiving ([ba444ac](https://gitlab.com/SmartSix/s6-ecms-be/commit/ba444ac))
* Alerts provider refactoring to decrease code duplication ([4292dad](https://gitlab.com/SmartSix/s6-ecms-be/commit/4292dad))
* Change endpoint for device commands ([b3bc564](https://gitlab.com/SmartSix/s6-ecms-be/commit/b3bc564))
* Device command to update firmware ([17533b8](https://gitlab.com/SmartSix/s6-ecms-be/commit/17533b8))
* Devices provider refactoring to decrease code duplication ([de4f749](https://gitlab.com/SmartSix/s6-ecms-be/commit/de4f749))
* Events provider refactoring to decrease code duplication ([5dbce28](https://gitlab.com/SmartSix/s6-ecms-be/commit/5dbce28))
* Export excel for daily statics ([d6b1d11](https://gitlab.com/SmartSix/s6-ecms-be/commit/d6b1d11))
* Export excel for hourly statistics ([4281b11](https://gitlab.com/SmartSix/s6-ecms-be/commit/4281b11))
* Gateway provider refactoring to reduce code duplication ([b7128b1](https://gitlab.com/SmartSix/s6-ecms-be/commit/b7128b1))
* Order data for export excel ([029b772](https://gitlab.com/SmartSix/s6-ecms-be/commit/029b772))
* Oredr data for export excel ([73e81f3](https://gitlab.com/SmartSix/s6-ecms-be/commit/73e81f3))
* Remove gateway field in excel export for daily stats ([d6bdbfd](https://gitlab.com/SmartSix/s6-ecms-be/commit/d6bdbfd))
* Stats provider refactoring to decrease code duplication ([b0c6f5b](https://gitlab.com/SmartSix/s6-ecms-be/commit/b0c6f5b))



