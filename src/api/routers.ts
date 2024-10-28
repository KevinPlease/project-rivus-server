import { Router } from "../network/Router";
import AuthRouter from "./auth/AuthRouter";
import RoleRouter from "./role/RoleRouter";
import UserRouter from "./user/UserRouter";

const ROUTERS: typeof Router[] = [ AuthRouter, UserRouter, RoleRouter ];

export { ROUTERS };
