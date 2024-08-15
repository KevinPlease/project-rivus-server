import { Router as ExpRouter } from "express";

import PropertyController from "./PropertyController";
import { MessengerFunction } from "../../Messenger";
import { RawRoutesInfo } from "../../network/types/RoutesInfo";
import { Router } from "../../network/Router";
import ROUTES from "./routes";

class PropertyRouter extends Router {
	constructor(router: ExpRouter, controller: PropertyController, routes: RawRoutesInfo, msngr: MessengerFunction) {
		super(router, controller, routes, msngr);
	}

	static create(expRouter: ExpRouter, say: MessengerFunction): PropertyRouter {
		const controller = new PropertyController(say);
		return new PropertyRouter(expRouter, controller, ROUTES, say);
	}
}

export default PropertyRouter;
