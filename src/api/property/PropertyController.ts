import Controller from "../../network/Controller";
import { MessengerFunction } from "../../Messenger";
import { Dictionary } from "../../types/Dictionary";
import { PropertyRepo } from "../../backend/repos/PropertyRepo";
import { IdentifiableDictionary } from "../../types/IdentifiableDictionary";
import { ListFilter } from "../../backend/types/ListFilter";
import { Property, PropertyData } from "../../backend/models/Property";

class PropertyController extends Controller {

	constructor(say: MessengerFunction) {
		super("property", "properties", say);
	}

	async post(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<PropertyData>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const domain = this.getOwningDomain(say);
		const branch = this.getOwningBranch(say);
		const repo = PropertyRepo.getInstance(say);
		const property = Property.create(say, request.body, { domain: domain.name, branch: branch.data.name });
		const operationStatus = await repo.add(property, say);
		if (operationStatus === "failure") return response.sendByInfo(operationStatus);

		const content: Dictionary = { property };
		return response.sendByInfo(operationStatus, content);
	}

	async postDocuments(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<IdentifiableDictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);
		const files = request.getUploadedFiles(say);
		return response.sendByInfo("success", files);
	}

	async postImages(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<IdentifiableDictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);
		const files = request.getUploadedFiles(say);
		return response.sendByInfo("success", files);
	}

	async getMany(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<ListFilter>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const repo = PropertyRepo.getInstance(say);
		const properties = await repo.detailedGetMany(say, request.query.filter, request.query.pagination);

		response
			.setType("success")
			.content = { properties };
		return response.send();
	}

	async get(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<IdentifiableDictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);
		
		const repo = PropertyRepo.getInstance(say);
		const property = await repo.detailedFindById(request.query.id, say);
		const responseType = property ? "success" : "notFound";

		response
			.setType(responseType)
			.content = { property };

		return response.send();
	}

	async getDocument(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<Dictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);
		
		const branchName = request.query.branch;
		if (!branchName) return response.setType("badRequest").send();
		
		const domain = this.getOwningDomain(say);
		const branch = domain.getBranchByName(branchName);
		if (!branch) return response.setType("badRequest").send();

		const repo = PropertyRepo.getInstance(say);
		const operation = await repo.getDocumentById(branchName, request.params.id, request.query.documentId, say);
		if (operation.status === "failure") response.setType("notFound");

		const resType = operation.status === "failure" ? "notFound" : "successDownload";
		response
			.setType(resType)
			.content = operation.message;

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

		const resType = imageOperation.status === "failure" ? "notFound" : "successDownload";
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
		const operation = await repo.editData(request.body._id, request.body.data, say);
		
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
