import express from "express";
import ApiKeys from "./ApiKeys2";
import { Request, Response, NextFunction } from "express";


class App {

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    private config(): void {
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            console.log(req.method + ' request for ' + req.url);
            next();
        });
    }

    private routes(): void {
        const router = express.Router();

        router.get('/ping', (req: Request, res: Response) => {
            res.send(200);
        });

        router.get('/apikeys', (req: Request, res: Response) => {
            res.status(200).send(ApiKeys.getInstance().getKeys().toJSON());
        });

        this.app.use('/', router);
    }

    public app: express.Application;

}

export default new App().app;
