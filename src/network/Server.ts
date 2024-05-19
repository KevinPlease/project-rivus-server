import { AnyFunction } from "../types/AnyFunction";
import { Dictionary } from "../types/Dictionary";

interface IClientProvider {
	inst: Object;
	options?: Dictionary;

	getRequestHandler(): (req: any, res: any, next?: AnyFunction) => void;
	prepare(): Promise<void>;
}

class NoClient implements IClientProvider {
	inst: Object;
	options?: Dictionary;

	constructor(inst: Object, options?: Dictionary) {
		this.inst = inst;
		this.options = options;
	}

	private dummyReqHandler(req: any, res: any, next?: AnyFunction): void {
		return;
	}

	public static create(options?: Dictionary) {
		const noInst = {};
		return new NoClient(noInst);
	}

	public getRequestHandler(): (req: any, res: any, next?: AnyFunction) => void {
		return this.dummyReqHandler;
	}

	public async prepare(): Promise<void> {
		return;		
	}

}

export type { IClientProvider };
export { NoClient };
