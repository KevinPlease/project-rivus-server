import { Model } from "../../core/Model";
import { MessengerFunction } from "../../Messenger";
import { Dictionary } from "../../types/Dictionary";
import { Operation } from "../../types/Operation";
import { DetailedFind } from "../types/DetailedFind";
import { DocType } from "../types/DocType";

interface IDocGenerator {

	type: DocType;
	
	options: Dictionary;
	
	generate(model: DetailedFind<Model<Dictionary>> | Dictionary, reportId: string, say: MessengerFunction): Promise<Operation>;

}

export default IDocGenerator;
