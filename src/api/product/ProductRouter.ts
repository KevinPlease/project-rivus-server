import { Router as ExpRouter } from "express";

import ProductController from "./ProductController";
import { MessengerFunction } from "../../Messenger";
import { RawRoutesInfo } from "../../network/types/RoutesInfo";
import { Router } from "../../network/Router";
import ROUTES from "./routes";

class ProductRouter extends Router {
	constructor(router: ExpRouter, routerMany: ExpRouter, controller: ProductController, routes: RawRoutesInfo, msngr: MessengerFunction) {
		super(router, routerMany, controller, routes, msngr);
	}

	static create(expRouter: ExpRouter, expRouterMany: ExpRouter, say: MessengerFunction): ProductRouter {
		const controller = new ProductController(say);
		return new ProductRouter(expRouter, expRouterMany, controller, ROUTES, say);
	}
}

export default ProductRouter;
