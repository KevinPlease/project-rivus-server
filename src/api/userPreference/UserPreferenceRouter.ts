import { Router as ExpRouter } from "express";

import UserPreferenceController from "./UserPreferenceController";
import { MessengerFunction } from "../../Messenger";
import { RawRoutesInfo } from "../../network/types/RoutesInfo";
import { Router } from "../../network/Router";
import ROUTES from "./routes";

class UserPreferenceRouter extends Router {
	constructor(router: ExpRouter, routerMany: ExpRouter, controller: UserPreferenceController, routes: RawRoutesInfo, msngr: MessengerFunction) {
		super(router, routerMany, controller, routes, msngr);
	}

	static create(expRouter: ExpRouter, expRouterMany: ExpRouter, say: MessengerFunction): UserPreferenceRouter {
		const controller = new UserPreferenceController(say);
		return new UserPreferenceRouter(expRouter, expRouterMany, controller, ROUTES, say);
	}
}

export default UserPreferenceRouter;
