"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HelpAction = /** @class */ (function () {
    function HelpAction() {
    }
    HelpAction.prototype.execute = function () {
        console.log("Received HELP action");
    };
    return HelpAction;
}());
exports.default = HelpAction;
