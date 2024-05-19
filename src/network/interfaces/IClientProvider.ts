import { AnyFunction } from "../../types/AnyFunction";
import { Dictionary } from "../../types/Dictionary";

interface IClientProvider {
	inst: Object;
	options?: Dictionary;

	getRequestHandler(): (req: any, res: any, next?: AnyFunction) => void;
	prepare(): Promise<void>;
}

export type { IClientProvider };
