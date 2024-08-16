import Express from "express";
import https from "https";
import Cors from "cors";
import BodyParser from "body-parser";

import { MessengerFunction } from "../Messenger";
import { ExString } from "../shared/String";
import NetworkUrl from "../network/NetworkUrl";

// Import router classes here
import { Response } from "../network/Response";
import { Communicator } from "../communications/Communicator";
import { RoleAuthorizer } from "../middleware/RoleAuthorizer";
import { UserAuthorizer } from "../middleware/UserAuthorizer";
import UserRateLimiter from "../middleware/UserRateLimiter";

import { ROUTERS } from "../api/routers";
import { BranchAuthorizer } from "../middleware/BranchAuthorizer";
import { DomainAuthorizer } from "../middleware/DomainAuthorizer";
import { IClientProvider } from "./interfaces/IClientProvider";
import { NextClient } from "./NextClientProvider";

const NON_NEXT_ROUTES = ["api"];

/**
 * The entry point for the server configurations and initating the connection.
 *
 **/
class WebServer extends Communicator {
	private _clientProvider: IClientProvider;
	private _express: Express.Express;
	private _config: {};
	private _msngr: MessengerFunction;
	private _sessCounter: number;
	private _serverStartToken: number;

	constructor(clientProvider: any, express: Express.Express, config: {}, msngr: MessengerFunction) {
		super();

		this._clientProvider = clientProvider;
		this._express = express;
		this._config = config;
		this._msngr = msngr;

		this._sessCounter = 0;
		this._serverStartToken = 0;
	}


	public get serverStartToken(): number { return this._serverStartToken }

	
	static async fromParts(config: {}, say: MessengerFunction): Promise<WebServer> {
		let webServer: WebServer;

		const msngr: MessengerFunction = (source, purpose, what, content) => {
			if (purpose === "ask") {
				switch (what) {
					case "session": return webServer._sessCounter;
				}
			}

			return say(source, purpose, what, content);
		};

		const CONNECTION_MODE = say(WebServer, "ask", "connectionMode");
		const isDev = CONNECTION_MODE === "development";
		const clientProvider = NextClient.create({ dev: isDev });
		const clientHandler = clientProvider.getRequestHandler();

		await clientProvider.prepare();
		
		let express = Express();
		webServer = new WebServer(clientProvider, express, config, msngr);

		express.use(Cors());
		express.use(BodyParser.json({limit: "100mb"}));

		express.get("*", (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
			const word = ExString.betweenFirstTwo(req.path, "/");
			if (NON_NEXT_ROUTES.includes(word)) return next();
			
			clientHandler(req, res);
		});

		if (isDev) { // localhost does not have two "." chars i.e: rivus.localhost:5000
			express.set("subdomain offset", 1);
		}

		await webServer.createRouters(msngr);
		webServer.startSubscription();

		return webServer;
	}
	

	say(purpose: string, what: string, content?: any) { return this._msngr(this, purpose, what, content) }


	async createRouters(msngr: MessengerFunction) {
		const express = this._express;

		for (const Router of ROUTERS) {
			const router = await Router
				.create(Express.Router(), msngr)
				.addAuthMiddleware	(new DomainAuthorizer())
				.addAuthMiddleware	(new BranchAuthorizer())
				.addAuthMiddleware	(new UserAuthorizer())
				.addAuthMiddleware	(new RoleAuthorizer())
				.addRateLimiter		(UserRateLimiter.create())
				.init();

			const pathForSingle = "/api/" + router.single;
			express.use(pathForSingle, router.expRouter);

			const pathForMany = "/api/" + router.many;
			express.use(pathForMany, router.expRouter);
		}
	}


	startSubscription() {
		// this.subscribe("api logging", (source, arg) => this.informApiLogging(source as Response<any>));
		this.subscribe("session started", (source, arg) => this._sessCounter += 1);
	}


	handleSecureRedirection(req: Express.Request, res: Express.Response, next: Express.NextFunction): void {
		if (!this.needsHttps(req)) {
			const nextServerHandle = this._clientProvider.getRequestHandler();
			nextServerHandle(req, res);
			return;
		}
			
		return res.redirect("https://" + req.headers.host + req.url);
	}

	
	informApiLogging(source: Response<any>): void {
		let session = this._sessCounter;
		let isVerbose = this.say("ask", "isVerbose");
		let content = isVerbose ? source.getVerboseLog(session) : source.getTerseLog(session);
		// TODO: Application should subscribe to this when Logging is functional through the Logger class.
		this.dispatch("log api", content);
		return;
	}


	needsHttps(request: Express.Request): boolean {
		const CONNECTION_MODE = this.say("ask", "connectionMode");
		const protocolFromConfig = this._config[CONNECTION_MODE].protocol;
		return protocolFromConfig === "https" && !request.secure;
	}

	
	createAndListenSecurely(certificationInfo: {}, startedListening: () => void): void {
		const CONNECTION_MODE = this.say("ask", "connectionMode");
		const CONN = this._config[CONNECTION_MODE];
		
		const express = this._express;
		const httpsServer = https.createServer(certificationInfo, express);
		httpsServer.listen(CONN.PORT, startedListening);
		express.listen(CONN.PORT + 1);
	}


	/**
	 * Start listening on the specified port
	 */
	start(): void {
		const CONNECTION_MODE = this.say("ask", "connectionMode");
		const CONN = this._config[CONNECTION_MODE];
		const onServerStarted = () => {
			console.log("Server is running on port: " + CONN.PORT);
			this._serverStartToken = Date.now();
			this.dispatch("server connected", "success from dispatcher");
		};

		this._express.listen(CONN.PORT, CONN.URL, onServerStarted);
		return;
		
		// NOTE: Custom SSL certification management.
		// if (CONNECTION_MODE === "development" || CONNECTION_MODE === "testing") {
		// 	this._express.listen(CONN.PORT, CONN.URL, onServerStarted);
		// 	return;
		// }
		// let certificationInfo = this.say("ask", "certificationInfo");
		// this.createAndListenSecurely(certificationInfo, onServerStarted);
	}


	getHostUrlForDomain(domainName: string): string {
		const CONNECTION_MODE = this.say("ask", "connectionMode");
		let config = this._config;
		let configForMode = config[CONNECTION_MODE];

		let protocol = config[CONNECTION_MODE].protocol;
		let subdomain = domainName.toLowerCase();
		let host = ExString.deprefix(configForMode.DOMAIN_NAME, `${subdomain}.`);
		let port = CONNECTION_MODE === "development" ? configForMode.PORT : null;
		return NetworkUrl.fromParts(protocol, subdomain, host, port);
	}
}

export default WebServer;
