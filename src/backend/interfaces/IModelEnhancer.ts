import { Model } from "../../core/Model";
import { MessengerFunction } from "../../Messenger";
import { Dictionary } from "../../types/Dictionary";
import { Operation } from "../../types/Operation";

interface IModelEnhancer {
	
	enhance(owningModel: Model<Dictionary>, model: Model<Dictionary> | Dictionary, say: MessengerFunction): Promise<Operation>;

}

export default IModelEnhancer;
