import { Router as ExpRouter } from "express";

import CustomerController from "./CustomerController";
import { MessengerFunction } from "../../Messenger";
import { RawRoutesInfo } from "../../network/types/RoutesInfo";
import { Router } from "../../network/Router";
import ROUTES from "./routes";

class CustomerRouter extends Router {
	constructor(router: ExpRouter, routerMany: ExpRouter, controller: CustomerController, routes: RawRoutesInfo, msngr: MessengerFunction) {
		super(router, routerMany, controller, routes, msngr);
	}

	static create(expRouter: ExpRouter, expRouterMany: ExpRouter, say: MessengerFunction): CustomerRouter {
		const controller = new CustomerController(say);
		return new CustomerRouter(expRouter, expRouterMany, controller, ROUTES, say);
	}
}

export default CustomerRouter;
