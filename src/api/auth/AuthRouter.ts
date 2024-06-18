import { Router as ExpRouter } from "express";

import { MessengerFunction } from "../../Messenger";
import { Router } from "../../network/Router";
import { RawRoutesInfo } from "../../network/types/RoutesInfo";
import AuthController from "./AuthController";
import ROUTES from "./routes";

class AuthRouter extends Router {
	constructor(router: ExpRouter, controller: AuthController, routes: RawRoutesInfo, msngr: MessengerFunction) {
		super(router, controller, routes, msngr);
	}

	static create(expRouter: ExpRouter, say: MessengerFunction): AuthRouter {
		const controller = new AuthController(say);
		return new AuthRouter(expRouter, controller, ROUTES, say);
	}
}

export default AuthRouter;
