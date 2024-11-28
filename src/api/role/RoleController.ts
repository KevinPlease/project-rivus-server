import Controller from "../../network/Controller";
import { MessengerFunction } from "../../Messenger";
import { Dictionary } from "../../types/Dictionary";
import { RoleRepo } from "../../backend/repos/RoleRepo";
import { IdentifiableDictionary } from "../../types/IdentifiableDictionary";
import { ListFilter } from "../../backend/types/ListFilter";
import { Role, RoleData } from "../../backend/models/Role";

class RoleController extends Controller {

	constructor(say: MessengerFunction) {
		super("role", "roles", say);
	}

	async post(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<RoleData>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const domain = this.getOwningDomain(say);
		const branch = this.getOwningBranch(say);
		const repo = RoleRepo.getInstance(say);
		const model = Role.create(say, request.body, { domain: domain.name, branch: branch.data.name });
		const operationStatus = await repo.add(model, say);
		if (operationStatus === "failure") return response.sendByInfo(operationStatus);

		const content: Dictionary = {}; 
		if (request.query.isDraft) {
			const roleContent = { formDetails: {}, model: {} };
			roleContent.formDetails = await repo.getFormDetails(say);
			roleContent.model = model;
			content.role = roleContent;
		} else {
			content.role = model;
		}

		return response.sendByInfo(operationStatus, content);
	}

	async getMany(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<ListFilter>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const repo = RoleRepo.getInstance(say);
		const roles = await repo.detailedGetMany(say, request.query.filter, request.query.pagination);

		response
			.setType("success")
			.content = { roles };
		return response.send();
	}

	async get(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<IdentifiableDictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);
		
		const repo = RoleRepo.getInstance(say);
		const role = await repo.detailedFindById(request.query.id, say);
		const responseType = role ? "success" : "notFound";

		response
			.setType(responseType)
			.content = { role };

		return response.send();
	}

	async getDraft(say: MessengerFunction) : Promise<void> {
		const response = this.getActiveResponse<Dictionary>(say);
		
		const repo = RoleRepo.getInstance(say);
		const role = await repo.findDraft(say);
		const responseType = role ? "success" : "notFound";

		response
			.setType(responseType)
			.content = { role };

		return response.send();
	}

	async getForm(say: MessengerFunction) : Promise<void> {
		const response = this.getActiveResponse<Dictionary>(say);
		
		const repo = RoleRepo.getInstance(say);
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
		const repo = RoleRepo.getInstance(say);
		const operation = await repo.editData(request.body._id, request.body.data, say);
		
		return response.sendByInfo(operation.status, operation.message);
	}

	async delete(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<IdentifiableDictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const repo = RoleRepo.getInstance(say);
		const operationStatus = await repo.remove(request.query.id, say);
		
		return response.sendByInfo(operationStatus);
	}

}

export default RoleController;
