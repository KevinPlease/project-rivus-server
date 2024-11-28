import { Router } from "../network/Router";
import AuthRouter from "./auth/AuthRouter";
import RoleRouter from "./role/RoleRouter";
import UserRouter from "./user/UserRouter";
import NotificationRouter from "./notification/NotificationRouter";


const ROUTERS: typeof Router[] = [
	AuthRouter,
	UserRouter,
	NotificationRouter
];

export { ROUTERS };
