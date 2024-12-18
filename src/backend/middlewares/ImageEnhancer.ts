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

class ImageEnhancer implements IModelEnhancer {
	
	async enhance(owningModel: Model<Dictionary>, model: ImageDetails, say: MessengerFunction): Promise<Operation> {
		const owningFolder = ModelFolder.fromInfo(owningModel.role, owningModel.getDomainName(), owningModel.getBranchName(), owningModel.id, say);
		const path = owningFolder.getImagesPath(say);
		const filePath = Folder.createPath(say, path, model.name);

		const options = {
			ratio: 0.2,		// Should be less than one
			opacity: 0.99, 	// Should be less than one
			dstPath: filePath,
			location: "top-right"
		};

		const waterMarkPath = Folder.createPath(say, "backend", "data", "watermark_simple.png");
		const status = await Functions.doSimpleAsync(ExJimp, "addWatermark", filePath, waterMarkPath, options);
		return { status, message: null };
	}

}

export default ImageEnhancer;
