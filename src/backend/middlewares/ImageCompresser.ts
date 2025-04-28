import ExJimp from "./Jimp";
import Folder from "../../files/Folder";

import { MessengerFunction } from "../../Messenger";
import { Functions } from "../../shared/Function";
import { Operation } from "../../types/Operation";
import IModelEnhancer from "../interfaces/IModelEnhancer";
import { ImageDetails } from "../types/ImageDetails";
import ModelFolder from "../../files/ModelFolder";
import { Dictionary } from "../../types/Dictionary";
import { Model } from "../../core/Model";

class ImageCompresser implements IModelEnhancer {
	
	async enhance(owningModel: Model<Dictionary>, model: ImageDetails, say: MessengerFunction): Promise<Operation> {
		const owningFolder = ModelFolder.fromInfo(owningModel.role, owningModel.getDomainName(), owningModel.getBranchName(), owningModel.id, say);
		const path = owningFolder.getImagesPath(say);
		const filePath = Folder.createPath(say, path, model.name);

		const options = {
			quality: 60
		};

		const status = await Functions.doSimpleAsync(ExJimp, "compress", filePath, options);
		return { status, message: null };
	}

}

export default ImageCompresser;
