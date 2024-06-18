import { Router } from "../network/Router";
import AuthRouter from "./auth/AuthRouter";
import UserRouter from "./user/UserRouter";

const ROUTERS: typeof Router[] = [ AuthRouter, UserRouter ];

export { ROUTERS };
