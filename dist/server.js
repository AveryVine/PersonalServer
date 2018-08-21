"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var App_1 = __importDefault(require("./App"));
var DiscordBot_1 = __importDefault(require("./DiscordBot/DiscordBot"));
var request_1 = __importDefault(require("request"));
var port = (process.env.PORT || 5000);
App_1.default.listen(port, function () {
    console.log('Express server listening on port ' + port);
    ping();
    setInterval(function () {
        ping();
    }, 1500000);
    var discordBot = new DiscordBot_1.default();
});
function ping() {
    console.log("Pinging...");
    request_1.default('http://avery-vine-server.herokuapp.com/ping', function (error) {
        if (error) {
            console.log('Failed to ping hosting service!');
        }
        else {
            console.log('Pinged hosting service to keep dyno awake.');
        }
    });
}
