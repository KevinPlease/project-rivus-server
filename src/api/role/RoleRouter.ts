import { Router as ExpRouter } from "express";

import { MessengerFunction } from "../../Messenger";
import { RawRoutesInfo } from "../../network/types/RoutesInfo";
import { Router } from "../../network/Router";
import ROUTES from "./routes";
import RoleController from "./RoleController";

class RoleRouter extends Router {
	constructor(router: ExpRouter, routerMany: ExpRouter, controller: RoleController, routes: RawRoutesInfo, msngr: MessengerFunction) {
		super(router, routerMany, controller, routes, msngr);
	}

	static create(expRouter: ExpRouter, expRouterMany: ExpRouter, say: MessengerFunction): RoleRouter {
		const controller = new RoleController(say);
		return new RoleRouter(expRouter, expRouterMany, controller, ROUTES, say);
	}
}

export default RoleRouter;
