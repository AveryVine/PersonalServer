"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TwitchAction = /** @class */ (function () {
    function TwitchAction(args) {
        this.args = args;
    }
    TwitchAction.prototype.execute = function () {
        console.log("Received TWITCH action");
    };
    return TwitchAction;
}());
exports.default = TwitchAction;
