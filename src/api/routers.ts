import { Router } from "../network/Router";
import AuthRouter from "./auth/AuthRouter";
import RoleRouter from "./role/RoleRouter";
import CustomerRouter from "./customer/CustomerRouter";
import OrderRouter from "./order/UnitRouter";
import PropertyRouter from "./property/PropertyRouter";
import UnitRouter from "./unit/UnitRouter";
import UserRouter from "./user/UserRouter";

const ROUTERS: typeof Router[] = [
	AuthRouter,
	UserRouter,
	RoleRouter,
	CustomerRouter,
	PropertyRouter,
	UnitRouter,
	OrderRouter
];

export { ROUTERS };
