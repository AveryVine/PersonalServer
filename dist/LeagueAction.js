"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LeagueActionType;
(function (LeagueActionType) {
    LeagueActionType["SUMMONER"] = "summoner";
    LeagueActionType["BANS"] = "bans";
})(LeagueActionType = exports.LeagueActionType || (exports.LeagueActionType = {}));
var LeagueAction = /** @class */ (function () {
    function LeagueAction(type, args) {
        this.type = type;
        this.args = args;
    }
    LeagueAction.prototype.execute = function () {
        console.log("Received LEAGUE " + this.type.toString() + " action");
    };
    return LeagueAction;
}());
exports.default = LeagueAction;
