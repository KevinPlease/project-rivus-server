import Controller from "../../network/Controller";
import { MessengerFunction } from "../../Messenger";
import { Dictionary } from "../../types/Dictionary";
import { PropertyRepo } from "../../backend/repos/PropertyRepo";
import { IdentifiableDictionary } from "../../types/IdentifiableDictionary";
import { ListFilter } from "../../backend/types/ListFilter";
import { Property, PropertyData } from "../../backend/models/Property";

class PropertyController extends Controller {

	constructor(say: MessengerFunction) {
		super("properties", say);
	}

	async post(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<PropertyData>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const domain = this.getOwningDomain(say);
		const branch = this.getOwningBranch(say);
		const repo = PropertyRepo.getInstance(say);
		const properties = Property.create(say, request.body, { domain: domain.name, branch: branch.data.name });
		const operationStatus = await repo.add(properties, say);
		if (operationStatus === "failure") return response.sendByInfo(operationStatus);

		const content: Dictionary = {}; 
		if (request.query.isDraft) {
			const userContent = { formDetails: {}, model: {} };
			userContent.formDetails = await repo.getFormDetails(say);
			userContent.model = properties;
			content.properties = userContent;
		} else {
			content.properties = properties;
		}

		return response.sendByInfo(operationStatus, content);
	}

	async postImages(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<IdentifiableDictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const repo = PropertyRepo.getInstance(say);
		const files = request.getUploadedFiles(say);
		const operationStatus = await repo.setImagesFromFiles(request.body.id, files, say);

		return response.sendByInfo(operationStatus);
	}

	async getMany(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<ListFilter>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const repo = PropertyRepo.getInstance(say);
		const users = await repo.detailedGetMany(say, request.query.filter, request.query.pagination);

		response
			.setType("success")
			.content = { users };
		return response.send();
	}

	async get(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<IdentifiableDictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);
		
		const repo = PropertyRepo.getInstance(say);
		const properties = await repo.detailedFindById(request.query.id, say);
		const responseType = properties ? "success" : "notFound";

		response
			.setType(responseType)
			.content = { properties };

		return response.send();
	}

	async getDraft(say: MessengerFunction) : Promise<void> {
		const response = this.getActiveResponse<Dictionary>(say);
		
		const repo = PropertyRepo.getInstance(say);
		const properties = await repo.findDraft(say);
		const responseType = properties ? "success" : "notFound";

		response
			.setType(responseType)
			.content = { properties };

		return response.send();
	}

	async getImage(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<Dictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);
		
		const branchName = request.query.branch;
		if (!branchName) return response.setType("badRequest").send();
		
		const domain = this.getOwningDomain(say);
		const branch = domain.getBranchByName(branchName);
		if (!branch) return response.setType("badRequest").send();

		const repo = PropertyRepo.getInstance(say);
		const imageOperation = await repo.getImageById(branchName, request.params.id, request.query.imageId, say);
		if (imageOperation.status === "failure") response.setType("notFound");

		const resType = imageOperation.status === "failure" ? "notFound" : "successFile";
		response
			.setType(resType)
			.content = imageOperation.message;

		return response.send();
	}

	async getForm(say: MessengerFunction) : Promise<void> {
		const response = this.getActiveResponse<Dictionary>(say);
		
		const repo = PropertyRepo.getInstance(say);
		const formDetails = await repo.getFormDetails(say);
		const responseType = formDetails ? "success" : "notFound";

		response
			.setType(responseType)
			.content = { formDetails };

		return response.send();
	}

	async put(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<Dictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);
		const repo = PropertyRepo.getInstance(say);

		const userId = this.getOwningUserId(say);
		const userData = request.body as PropertyData;
		const operation = await repo.editData(userId, userData, say);
		
		return response.sendByInfo(operation.status, operation.message);
	}

	async delete(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<IdentifiableDictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const repo = PropertyRepo.getInstance(say);
		const operationStatus = await repo.remove(request.query.id, say);
		
		return response.sendByInfo(operationStatus);
	}

}

export default PropertyController;
