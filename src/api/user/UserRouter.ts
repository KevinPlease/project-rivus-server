import { Router as ExpRouter } from "express";

import UserController from "./UserController";
import { MessengerFunction } from "../../Messenger";
import { RawRoutesInfo } from "../../network/types/RoutesInfo";
import { Router } from "../../network/Router";
import ROUTES from "./routes";

class UserRouter extends Router {
	constructor(router: ExpRouter, routerMany: ExpRouter, controller: UserController, routes: RawRoutesInfo, msngr: MessengerFunction) {
		super(router, routerMany, controller, routes, msngr);
	}

	static create(expRouter: ExpRouter, expRouterMany: ExpRouter, say: MessengerFunction): UserRouter {
		const controller = new UserController(say);
		return new UserRouter(expRouter, expRouterMany, controller, ROUTES, say);
	}
}

export default UserRouter;
