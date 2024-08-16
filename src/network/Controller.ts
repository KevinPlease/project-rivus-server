import { Request as ExpRequest, Response as ExpResponse } from "express";
import { Branch } from "../backend/models/Branch";
import { Domain } from "../backend/models/Domain";
import { MessengerFunction } from "../Messenger";
import { MethodType, Request } from "../network/Request";
import { Response } from "../network/Response";
import { Dictionary } from "../types/Dictionary";
import { Communicator } from "../communications/Communicator";

class Controller extends Communicator {
	private _msngr: MessengerFunction;
	private _name: string;
	private _plural: string;

	constructor(name: string, plural: string, msngr: MessengerFunction) {
		super();

		this._name = name;
		this._plural = plural;
		this._msngr = msngr;
	}

	public get name(): string { return this._name }
	public set name(value: string) { this._name = value }
	public get plural(): string { return this._plural }
	public set plural(value: string) { this._plural = value }

	public say(purpose: string, what: string, content: any): any {
		return this._msngr(this, purpose, what, content);
	}

	public getActiveRequest<Filter extends Dictionary>(say: MessengerFunction): Request<Filter> {
		const expRequest: ExpRequest = say(this, "ask", "request");
		const method = expRequest.method as MethodType;
		return new Request<Filter>(expRequest.headers, expRequest.body, expRequest.query, expRequest.path, expRequest.params, method);
	}

	public getActiveResponse<Data>(say: MessengerFunction): Response<Data> {
		const expResponse: ExpResponse = say(this, "ask", "response");
		return Response.noContent<Data>(expResponse);
	}

	public getOwningDomain(say: MessengerFunction): Domain {
		return say(this, "ask", "ownDomain");
	}

	public getOwningBranch(say: MessengerFunction): Branch {
		return say(this, "ask", "ownBranch");
	}

	public getOwningUserId(say: MessengerFunction): string {
		return say(this, "ask", "ownUserId");
	}

}

export default Controller;
