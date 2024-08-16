import { Router as ExpRouter, Response as ExpResponse, NextFunction as ExpNextFunc } from "express";

import ArrayOps from "../shared/Array";
import Controller from "./Controller";
import { Domain } from "../backend/models/Domain";
import { MessengerFunction } from "../Messenger";
import { Response } from "../network/Response";
import { ExString } from "../shared/String";
import { Functions } from "../shared/Function";
import IAuthorizer from "../middleware/interfaces/IAuthorizer";
import { RawResourceInfo, RawRoutesInfo, RouteInfo } from "./types/RoutesInfo";
import { ActionRepo } from "../backend/repos/ActionRepo";
import IRateLimiter from "../middleware/interfaces/IRateLimiter";
import IRepository from "../backend/interfaces/IRepository";
import { Dictionary } from "../types/Dictionary";
import { Branch } from "../backend/models/Branch";
import { Operation, OperationStatus } from "../types/Operation";
import { RequestAuthInfo } from "../middleware/types/RequestAuthInfo";
import { IncomingHttpHeaders } from "http";
import ImageUploader from "../middleware/uploaders/ImageUploader";
import { MExpRequest } from "./types/MExpRequest";
import DocumentUploader from "../middleware/uploaders/DocumentUploader";
import RepoRequest from "../backend/types/RepoRequest";
import OwnRequestData from "../backend/types/OwnRequestData";
import DocumentStorage from "../middleware/uploaders/DocumentStorage";
import ImageStorage from "../middleware/uploaders/ImageStorage";
import ImageEnhancement from "../enhancers/ImageEnhancement";

interface MReqHeaders extends IncomingHttpHeaders {
	branch: string
}

type RouteHandler = (request: MExpRequest, response: ExpResponse, next: ExpNextFunc) => void;

class Router {
	private _authorizers: IAuthorizer[];
	private _controller: Controller;
	private _expRouter: ExpRouter;
	private _expRouterMany: ExpRouter;
	private _msngr: MessengerFunction;
	private _rateLimiter: IRateLimiter | null;
	private _routes: RawRoutesInfo;

	constructor(expRouter: ExpRouter, expRouterMany: ExpRouter, controller: Controller, routes: RawRoutesInfo, msngr: MessengerFunction) {
		this._expRouter = expRouter;
		this._expRouterMany = expRouterMany;
		this._controller = controller;
		this._authorizers = [];
		this._rateLimiter = null;
		this._routes = routes;
		this._msngr = msngr;
	}

	public get expRouter(): ExpRouter { return this._expRouter }
	public get expRouterMany(): ExpRouter { return this._expRouterMany }
	public get single(): string { return this._controller.name }
	public get many(): string { return this._controller.plural }

	public static create(expRouter: ExpRouter, expRouterMany: ExpRouter, say: MessengerFunction): Router {
		let controller = new Controller("", "", say);
		return new Router(expRouter, expRouterMany, controller, {}, say);
	}

	public say(purpose: string, what: string, content: any): any {
		return this._msngr(this, purpose, what, content);
	}

	public async init(): Promise<Router> {
		const routes = this._routes;
		const actionRepo = ActionRepo.getInstance(this._msngr);
		
		for (const reqMethod in routes) {
			const resourceInfo: RawResourceInfo = routes[reqMethod];
			for (const resourceName in resourceInfo) {
				const rawRouteInfo = resourceInfo[resourceName];
				const actionId = await actionRepo.getActionIdByName(rawRouteInfo.actionName);
				if (!actionId) console.error(`Action missing in database for name: ${rawRouteInfo.actionName}`);

				const routeInfo = { needsAuth: rawRouteInfo.needsAuth, actionId };
				this.setRoute(resourceName, reqMethod, routeInfo);
			}
		}

		return this;
	}

	public addAuthMiddleware(authorizer: IAuthorizer): Router {
		this._authorizers.push(authorizer);
		return this;
	}

	public addRateLimiter(rateLimiter: IRateLimiter): Router {
		this._rateLimiter = rateLimiter;
		// @ts-ignore
		this._expRouter.all("*", Functions.bound(this, "conformRequest"));
		this._expRouterMany.all("*", Functions.bound(this, "conformRequest"));
		return this;
	}

	public getDomainFromRequest(req: MExpRequest): Domain {
		let subdomain: string = ArrayOps.last(req.subdomains);
		return Domain.byName(subdomain, this._msngr);
	}

	public getBranchFromRequest(req: MExpRequest): Branch {
		const branchName = req.headers.branch as string;
		const domain = this.getDomainFromRequest(req);
		return domain.getBranchByName(branchName);
	}

	public getUserFromRequest(req: MExpRequest): string {
		return req.user?.id || "";
	}

	public validateRequest(req: MExpRequest): Operation {
		let status: OperationStatus = "success";
		let message: string = "";

		const domain = this.getDomainFromRequest(req);
		if (!domain) {
			status = "failure";
			message = "Invalid domain name!";
		}

		const branch = this.getBranchFromRequest(req);
		if (!branch) {
			status = "failure";
			message = "Invalid branch name!";
		}

		return { status, message };
	}

	public getRepoFromRequest(repoName: string, req: MExpRequest): IRepository<Dictionary> | null {
		const domain = this.getDomainFromRequest(req);
		if (!domain) return null;

		const repoRequest: RepoRequest = { domain, repoName };
		return this.say("ask", "repoForInfo", repoRequest);
	}

	public askForOwnWork(type: string, data: Dictionary, req: MExpRequest): IRepository<Dictionary> | null {
		const domain = this.getDomainFromRequest(req);
		if (!domain) return null;

		const branch = this.getBranchFromRequest(req);
		const reqOwnership: OwnRequestData = { domain, branch, data };
		return this.say("ask", type, reqOwnership);
	}

	public getRequestMsngr(req: MExpRequest, res: ExpResponse, next: ExpNextFunc): MessengerFunction {
		const parentMsngr = this._msngr;
		return (source: Object, purpose: string, what: string, content: any): any => {
			if (purpose === "ask") {
				switch (what) {
					case "ownDomain": return this.getDomainFromRequest(req);
					case "ownBranch": return this.getBranchFromRequest(req);
					case "ownUserId": return this.getUserFromRequest(req);

					case "request": return req;
					case "response": return res;

					case "repo": return this.getRepoFromRequest(content, req);
					case "work": return this.askForOwnWork("work", content, req);
					case ImageEnhancement.ROLE: return this.askForOwnWork(ImageEnhancement.ROLE, content, req);
				}
			}

			return parentMsngr(source, purpose, what, content);
		};
	}

	public handleMethod(methodName: string, req: MExpRequest, res: ExpResponse, next: ExpNextFunc): Promise<void> {
		if (!this._controller[methodName]) throw `No Controller method defined for this API: ${methodName}`;

		const msngr = this.getRequestMsngr(req, res, next);
		return Functions.doAsync(this._controller, methodName, msngr);
	}

	public getHandler(methodName: string): RouteHandler {
		return (req: MExpRequest, res: ExpResponse, next: ExpNextFunc): any => {
			return this.handleMethod(methodName, req, res, next);
		};
	}

	public setRoute(resourceName: string, reqMethod: string, routeInfo: RouteInfo): Router {
		let router = this._expRouter;
		let name = resourceName;
		if (resourceName === "*") {
			name = "Many";
			resourceName = "";
			router = this._expRouterMany;
		} else {
			name = ExString.capitalize(ExString.upToBefore(resourceName, "/"));
		}
		
		const methodName = reqMethod + name;
		const method = this.getHandler(methodName);
		const authorizeRequest = Functions.bound(this, "authorizeRequest", routeInfo);
		const middlewares = [authorizeRequest];
		const uploader = this.getUploader(name);
		if (uploader) middlewares.push(uploader);

		router[reqMethod](`/${resourceName}`, ...middlewares, method);

		return this;
	}

	public async authorizeRequest(routeInfo: RouteInfo, req: MExpRequest, res: ExpResponse, next: ExpNextFunc) {
		const headers = req.headers as MReqHeaders;
		const domain = ArrayOps.last(req.subdomains) || "";
		const reqAuthInfo: RequestAuthInfo = { authToken: headers.authorization || "", branchName: headers.branch, domainName: domain, ...routeInfo };
		const msngr = this.getRequestMsngr(req, res, next);
		const authorizers = this._authorizers;

		const authorizersToUse = reqAuthInfo.needsAuth === false ? 1 : authorizers.length;
		for (let i = 0; i < authorizersToUse; i += 1) {
			const authRes = await authorizers[i].checkAuthorization(reqAuthInfo, msngr);
			if (!authRes.isAuthorized) return Response.unauthorized(res, authRes.content).send();
		}

		next();
	}

	public getUploader(mediaType: string) : RouteHandler | null {
		const modelRole = ExString.capitalize(this.single);
		mediaType = mediaType.toLowerCase();
		if (mediaType !== "images" && mediaType !== "documents") return null;

		const self = this;
		function handleUpload(req: MExpRequest, res: ExpResponse, next: ExpNextFunc) {
			const msngr = self.getRequestMsngr(req, res, next);
		
			if (mediaType === "images") {
				const imgStorageMiddleware = new ImageStorage(modelRole);
				return ImageUploader
					.create(imgStorageMiddleware, msngr)
					.callExpHandler(mediaType, req, res, next);

			} else if (mediaType === "documents") {
				const docStorageMiddleware = new DocumentStorage(modelRole);
				return DocumentUploader
					.create(docStorageMiddleware, msngr)
					.callExpHandler(mediaType, req, res, next);
			}
		}

		return handleUpload;
	}

	public async conformRequest(req: MExpRequest, res: ExpResponse, next: ExpNextFunc) {
		const authToken = req.headers.authorization || "";
		// TODO: The separation between UserRateLimiter and the ip rate limit case here, must be more explicit (e.g. another rateLimiter strategy?)
		const info = await this.say("ask", "infoFromToken", authToken) || { id: req.ip };
		if (!info) return Response.unauthorized(res).send();

		const conformity = this._rateLimiter?.conform({ userId: info.id });
		if (!conformity || !conformity.isOk) return Response.forbidden(res, "Rate limit reached for this user! Please try again later.").send();

		next();
	}

}

export { Router };
export type { RouteHandler };

