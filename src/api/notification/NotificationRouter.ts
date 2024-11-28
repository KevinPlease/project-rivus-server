import { Router as ExpRouter } from "express";

import NotificationController from "./NotificationController";
import { MessengerFunction } from "../../Messenger";
import { RawRoutesInfo } from "../../network/types/RoutesInfo";
import { Router } from "../../network/Router";
import ROUTES from "./routes";

class NotificationRouter extends Router {
    constructor(router: ExpRouter, routerMany: ExpRouter, controller: NotificationController, routes: RawRoutesInfo, msngr: MessengerFunction) {
        super(router, routerMany, controller, routes, msngr);
    }

    static create(expRouter: ExpRouter, expRouterMany: ExpRouter, say: MessengerFunction): NotificationRouter {
        const controller = new NotificationController(say);
        return new NotificationRouter(expRouter, expRouterMany, controller, ROUTES, say);
    }
}

export default NotificationRouter;
