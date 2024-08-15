import { Router as ExpRouter } from "express";

import OrderController from "./OrderController";
import { MessengerFunction } from "../../Messenger";
import { RawRoutesInfo } from "../../network/types/RoutesInfo";
import { Router } from "../../network/Router";
import ROUTES from "./routes";

class OrderRouter extends Router {
	constructor(router: ExpRouter, controller: OrderController, routes: RawRoutesInfo, msngr: MessengerFunction) {
		super(router, controller, routes, msngr);
	}

	static create(expRouter: ExpRouter, say: MessengerFunction): OrderRouter {
		const controller = new OrderController(say);
		return new OrderRouter(expRouter, controller, ROUTES, say);
	}
}

export default OrderRouter;
