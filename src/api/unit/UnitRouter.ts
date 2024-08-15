import { Router as ExpRouter } from "express";

import UnitController from "./UnitController";
import { MessengerFunction } from "../../Messenger";
import { RawRoutesInfo } from "../../network/types/RoutesInfo";
import { Router } from "../../network/Router";
import ROUTES from "./routes";

class UnitRouter extends Router {
	constructor(router: ExpRouter, controller: UnitController, routes: RawRoutesInfo, msngr: MessengerFunction) {
		super(router, controller, routes, msngr);
	}

	static create(expRouter: ExpRouter, say: MessengerFunction): UnitRouter {
		const controller = new UnitController(say);
		return new UnitRouter(expRouter, controller, ROUTES, say);
	}
}

export default UnitRouter;
