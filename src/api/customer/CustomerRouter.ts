import { Router as ExpRouter } from "express";

import CustomerController from "./CustomerController";
import { MessengerFunction } from "../../Messenger";
import { RawRoutesInfo } from "../../network/types/RoutesInfo";
import { Router } from "../../network/Router";
import ROUTES from "./routes";

class CustomerRouter extends Router {
	constructor(router: ExpRouter, controller: CustomerController, routes: RawRoutesInfo, msngr: MessengerFunction) {
		super(router, controller, routes, msngr);
	}

	static create(expRouter: ExpRouter, say: MessengerFunction): CustomerRouter {
		const controller = new CustomerController(say);
		return new CustomerRouter(expRouter, controller, ROUTES, say);
	}
}

export default CustomerRouter;
