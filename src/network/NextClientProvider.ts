import Next from "next";

import { AnyFunction } from "../types/AnyFunction";
import { Dictionary } from "../types/Dictionary";
import { IClientProvider } from "./interfaces/IClientProvider";
import { NextServer } from "next/dist/server/next";

class NextClient implements IClientProvider {
	inst: NextServer;
	options?: Dictionary;

	constructor(inst: any, options?: Dictionary) {
		this.inst = inst;
		this.options = options;
	}

	public static create(options?: Dictionary) {
		const inst = Next({ dev: options?.dev, port: options?.port, hostname: options?.hostname });
		return new NextClient(inst);
	}

	public getRequestHandler(): (req: any, res: any, next?: AnyFunction) => void {
		return this.inst.getRequestHandler() as (req: any, res: any, next?: AnyFunction) => void;
	}

	public prepare(): Promise<void> {
		return this.inst.prepare();
	}
}

export { NextClient };
