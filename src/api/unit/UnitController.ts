import Controller from "../../network/Controller";
import { MessengerFunction } from "../../Messenger";
import { Dictionary } from "../../types/Dictionary";
import { UnitRepo } from "../../backend/repos/UnitRepo";
import { IdentifiableDictionary } from "../../types/IdentifiableDictionary";
import { ListFilter } from "../../backend/types/ListFilter";
import { Unit, UnitData } from "../../backend/models/Unit";

class UnitController extends Controller {

	constructor(say: MessengerFunction) {
		super("unit", "units", say);
	}

	async post(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<UnitData>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const domain = this.getOwningDomain(say);
		const branch = this.getOwningBranch(say);
		const repo = UnitRepo.getInstance(say);
		const unit = Unit.create(say, request.body, { domain: domain.name, branch: branch.data.name });
		const operationStatus = await repo.add(unit, say);
		if (operationStatus === "failure") return response.sendByInfo(operationStatus);

		const content: Dictionary = { unit };
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

		const repo = UnitRepo.getInstance(say);
		const units = await repo.detailedGetMany(say, request.query.filter, request.query.pagination);

		response
			.setType("success")
			.content = { units };
		return response.send();
	}

	async get(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<IdentifiableDictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);
		
		const repo = UnitRepo.getInstance(say);
		const unit = await repo.detailedFindById(request.query.id, say);
		const responseType = unit ? "success" : "notFound";

		response
			.setType(responseType)
			.content = { unit };

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

		const repo = UnitRepo.getInstance(say);
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

		const repo = UnitRepo.getInstance(say);
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
		
		const repo = UnitRepo.getInstance(say);
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
		const repo = UnitRepo.getInstance(say);
		const operation = await repo.editData(request.body._id, request.body.data, say);
		
		return response.sendByInfo(operation.status, operation.message);
	}

	async delete(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<IdentifiableDictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const repo = UnitRepo.getInstance(say);
		const operationStatus = await repo.remove(request.query.id, say);
		
		return response.sendByInfo(operationStatus);
	}

}

export default UnitController;
