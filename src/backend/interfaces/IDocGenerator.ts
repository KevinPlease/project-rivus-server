import { Model } from "../../core/Model";
import { MessengerFunction } from "../../Messenger";
import { Dictionary } from "../../types/Dictionary";
import { Operation } from "../../types/Operation";

type DocType = "pdf";

interface IDocGenerator {

	type: DocType;

	generate(model: Model<Dictionary> | Dictionary, say: MessengerFunction): Promise<Operation>;

}

export default IDocGenerator;
