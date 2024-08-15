import { Router } from "../network/Router";
import AuthRouter from "./auth/AuthRouter";
import CustomerRouter from "./customer/CustomerRouter";
import OrderRouter from "./order/UnitRouter";
import PropertyRouter from "./property/PropertyRouter";
import UnitRouter from "./unit/UnitRouter";
import UserRouter from "./user/UserRouter";

const ROUTERS: typeof Router[] = [
	AuthRouter,
	UserRouter,
	CustomerRouter,
	PropertyRouter,
	UnitRouter,
	OrderRouter
];

export { ROUTERS };
