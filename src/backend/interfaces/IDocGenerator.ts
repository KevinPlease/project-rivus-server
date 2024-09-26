import { Model } from "../../core/Model";
import { MessengerFunction } from "../../Messenger";
import { Dictionary } from "../../types/Dictionary";
import { Operation } from "../../types/Operation";
import { DocType } from "../types/DocType";

interface IDocGenerator {

	type: DocType;
	
	options: Dictionary;
	
	generate(model: Model<Dictionary> | Dictionary, say: MessengerFunction): Promise<Operation>;

}

export default IDocGenerator;
