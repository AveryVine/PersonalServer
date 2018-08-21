"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var YouTubeAction = /** @class */ (function () {
    function YouTubeAction(args) {
        this.args = args;
    }
    YouTubeAction.prototype.execute = function () {
        console.log("Received YOUTUBE action");
    };
    return YouTubeAction;
}());
exports.default = YouTubeAction;
