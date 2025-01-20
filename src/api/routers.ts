import { Router } from "../network/Router";
import AuthRouter from "./auth/AuthRouter";
import RoleRouter from "./role/RoleRouter";
import UserRouter from "./user/UserRouter";
import NotificationRouter from "./notification/NotificationRouter";
import UserPreferenceRouter from "./userPreference/UserPreferenceRouter";
import ProductRouter from "./product/ProductRouter";
import CustomerRouter from "./customer/CustomerRouter";
import OrderRouter from "./order/OrderRouter";


const ROUTERS: typeof Router[] = [
	AuthRouter,
	RoleRouter,
	UserRouter,
	UserPreferenceRouter,
	NotificationRouter,
	CustomerRouter,
	OrderRouter,
	ProductRouter
];

export { ROUTERS };
