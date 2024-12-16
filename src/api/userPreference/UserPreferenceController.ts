import Controller from "../../network/Controller";
import { MessengerFunction } from "../../Messenger";
import { Dictionary } from "../../types/Dictionary";
import { UserPreferenceRepo } from "../../backend/repos/UserPreferenceRepo";
import { IdentifiableDictionary } from "../../types/IdentifiableDictionary";
import { ListFilter } from "../../backend/types/ListFilter";
import { UserPreference, UserPreferenceData } from "../../backend/models/UserPreference";

class UserPreferenceController extends Controller {
	constructor(say: MessengerFunction) {
		super("userPreference", "userPreferences", say);
	}

	async post(say: MessengerFunction): Promise<void> {
		const request = this.getActiveRequest<UserPreferenceData>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const domain = this.getOwningDomain(say);
		const branch = this.getOwningBranch(say);
		const repo = UserPreferenceRepo.getInstance(say);
		const userPreferences = UserPreference.create(say, request.body, { domain: domain.name, branch: branch.data.name });
		const operationStatus = await repo.add(userPreferences, say);

		const content: Dictionary = { userPreferences };
		return response.sendByInfo(operationStatus, content);
	}

	async getMany(say: MessengerFunction): Promise<void> {
		const request = this.getActiveRequest<ListFilter>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const repo = UserPreferenceRepo.getInstance(say);
		const userPreferences = await repo.detailedGetMany(say, request.query.filter, request.query.pagination);

		response
			.setType("success")
			.content = { userPreferences };
		return response.send();
	}

	async get(say: MessengerFunction): Promise<void> {
		const request = this.getActiveRequest<IdentifiableDictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);
		
		const repo = UserPreferenceRepo.getInstance(say);
		const userPreferences = await repo.detailedFindById(request.query.id, say);
		const responseType = userPreferences ? "success" : "notFound";

		response
			.setType(responseType)
			.content = { userPreferences };

		return response.send();
	}

	async put(say: MessengerFunction): Promise<void> {
		const request = this.getActiveRequest<Dictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const repo = UserPreferenceRepo.getInstance(say);
		const operation = await repo.editData(request.body.id, request.body, say);

		return response.sendByInfo(operation.status, operation.message);
	}

	async delete(say: MessengerFunction): Promise<void> {
		const request = this.getActiveRequest<IdentifiableDictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const repo = UserPreferenceRepo.getInstance(say);
		const operationStatus = await repo.remove(request.query.id, say);

		return response.sendByInfo(operationStatus);
	}
}

export default UserPreferenceController;
