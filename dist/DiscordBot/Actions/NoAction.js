"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NoAction = /** @class */ (function () {
    function NoAction() {
    }
    NoAction.prototype.execute = function () {
        console.log("Received NO action");
    };
    return NoAction;
}());
exports.default = NoAction;
