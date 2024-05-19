import { AnyFunction } from "../../types/AnyFunction";
import { Dictionary } from "../../types/Dictionary";

interface IClientProvider {
	inst: any;
	options?: Dictionary;

	getRequestHandler(): (req: any, res: any, next?: AnyFunction) => void;
	prepare(): Promise<void>;
}

export type { IClientProvider };
