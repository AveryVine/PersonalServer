"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PingAction = /** @class */ (function () {
    function PingAction() {
    }
    PingAction.prototype.execute = function () {
        console.log("Received PING action");
    };
    return PingAction;
}());
exports.default = PingAction;
