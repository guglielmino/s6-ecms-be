<a name="1.10.0"></a>
# 1.10.0 (2017-06-06)


### Bug Fixes

* Add log for device null in energy processor ([25ec4ef](https://gitlab.com/smart-office-iot/iot-project-server/commit/25ec4ef))
* Fix device command handling after paylod change ([9b4610c](https://gitlab.com/smart-office-iot/iot-project-server/commit/9b4610c))
* Fix event API read feedback ([c89fffc](https://gitlab.com/smart-office-iot/iot-project-server/commit/c89fffc))
* Fix get alert in update read status endpoint ([612d7ba](https://gitlab.com/smart-office-iot/iot-project-server/commit/612d7ba))
* Fix get of nonexistent device and read of device id from path ([07c7f16](https://gitlab.com/smart-office-iot/iot-project-server/commit/07c7f16))
* Fix modify of an existing device for Info1 event ([87a21d1](https://gitlab.com/smart-office-iot/iot-project-server/commit/87a21d1))
* Fix payload change for power command ([a9771d6](https://gitlab.com/smart-office-iot/iot-project-server/commit/a9771d6))
* Fix wrong command constant for power event in rule engine and add log in energy processor for d ([2b2cfe0](https://gitlab.com/smart-office-iot/iot-project-server/commit/2b2cfe0))
* Fix wrong use of passed gateway code in /api/gateways/{code} ([6b1ee81](https://gitlab.com/smart-office-iot/iot-project-server/commit/6b1ee81))


### Features

* Add alert on power status change failure ([1f361a7](https://gitlab.com/smart-office-iot/iot-project-server/commit/1f361a7))
* Add createIndex to DataProvider to encapsulate index creation ([b38cffe](https://gitlab.com/smart-office-iot/iot-project-server/commit/b38cffe))
* Add delete alert endpoint ([9ff9228](https://gitlab.com/smart-office-iot/iot-project-server/commit/9ff9228))
* Add device commands endpoint ([297aa8c](https://gitlab.com/smart-office-iot/iot-project-server/commit/297aa8c))
* Add endpoint to get single device data ([e416b35](https://gitlab.com/smart-office-iot/iot-project-server/commit/e416b35))
* Add endpoint to mark alert read/unread ([8331828](https://gitlab.com/smart-office-iot/iot-project-server/commit/8331828))
* Add energy alerts (power == 0 when device is on) aggregation for same device/gateway in given ([7c4e7f0](https://gitlab.com/smart-office-iot/iot-project-server/commit/7c4e7f0))
* Add gateway field to device DTO ([32a2397](https://gitlab.com/smart-office-iot/iot-project-server/commit/32a2397))
* Add id to api response ([4665b38](https://gitlab.com/smart-office-iot/iot-project-server/commit/4665b38))
* Add level to alerts and expose it in API responses ([00c76e4](https://gitlab.com/smart-office-iot/iot-project-server/commit/00c76e4))
* Add logging of unknown events ([acdfd4c](https://gitlab.com/smart-office-iot/iot-project-server/commit/acdfd4c))
* Add Power Action feedback alert infrastructure ([b70ca42](https://gitlab.com/smart-office-iot/iot-project-server/commit/b70ca42))
* Add socketio timeout authentication in config ([5b035de](https://gitlab.com/smart-office-iot/iot-project-server/commit/5b035de))
* Alerts provider refactoring to decrease code duplication ([4292dad](https://gitlab.com/smart-office-iot/iot-project-server/commit/4292dad))
* Change endpoint for device commands ([b3bc564](https://gitlab.com/smart-office-iot/iot-project-server/commit/b3bc564))
* Devices provider refactoring to decrease code duplication ([de4f749](https://gitlab.com/smart-office-iot/iot-project-server/commit/de4f749))
* Events provider refactoring to decrease code duplication ([5dbce28](https://gitlab.com/smart-office-iot/iot-project-server/commit/5dbce28))
* Gateway provider refactoring to reduce code duplication ([b7128b1](https://gitlab.com/smart-office-iot/iot-project-server/commit/b7128b1))
* Stats provider refactoring to decrease code duplication ([b0c6f5b](https://gitlab.com/smart-office-iot/iot-project-server/commit/b0c6f5b))



