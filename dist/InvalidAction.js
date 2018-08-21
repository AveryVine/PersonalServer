"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InvalidAction = /** @class */ (function () {
    function InvalidAction() {
    }
    InvalidAction.prototype.execute = function () {
        console.log("Received INVALID action");
    };
    return InvalidAction;
}());
exports.default = InvalidAction;
