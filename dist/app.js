"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var ApiKeys_1 = __importDefault(require("./ApiKeys"));
var App = /** @class */ (function () {
    function App() {
        this.app = express_1.default();
        this.config();
        this.routes();
    }
    App.prototype.config = function () {
        this.app.use(function (req, res, next) {
            console.log(req.method + ' request for ' + req.url);
            next();
        });
    };
    App.prototype.routes = function () {
        var router = express_1.default.Router();
        router.get('/ping', function (req, res) {
            res.send(200);
        });
        router.get('/apikeys', function (req, res) {
            res.status(200).send(ApiKeys_1.default.getInstance().getKeys().toJSON());
        });
        this.app.use('/', router);
    };
    return App;
}());
exports.default = new App().app;
