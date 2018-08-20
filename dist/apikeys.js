"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typescript_map_1 = require("typescript-map");
var ApiKeys = /** @class */ (function () {
    function ApiKeys() {
        this.discord = process.env.DISCORD;
        this.riot = process.env.RIOT;
        this.championGG = process.env.CHAMPION_GG;
        this.google = process.env.GOOGLE;
        this.twitch = process.env.TWITCH;
    }
    ApiKeys.prototype.getKeys = function () {
        return new typescript_map_1.TSMap([
            ['discord', this.discord],
            ['riot', this.riot],
            ['championGG', this.championGG],
            ['google', this.google],
            ['twitch', this.twitch]
        ]);
    };
    ApiKeys.getInstance = function () {
        if (!ApiKeys.instance) {
            ApiKeys.instance = new ApiKeys();
        }
        return ApiKeys.instance;
    };
    return ApiKeys;
}());
exports.default = ApiKeys;
