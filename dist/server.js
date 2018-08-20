"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("./app"));
var discordbot_1 = __importDefault(require("./discordbot"));
var http_1 = require("http");
var port = (process.env.PORT || 5000);
app_1.default.listen(port, function () {
    console.log('Express server listening on port ' + port);
    ping();
    setInterval(function () {
        ping();
    }, 1500000);
    var discordBot = new discordbot_1.default();
});
function ping() {
    console.log("Pinging...");
    http_1.request('http://localhost:5000/ping', function (error) {
        // request('http://avery-vine-server.herokuapp.com/ping', function (error) {
        if (error) {
            console.log('Failed to ping hosting service!');
        }
        else {
            console.log('Pinged hosting service to keep dyno awake.');
        }
    });
}
