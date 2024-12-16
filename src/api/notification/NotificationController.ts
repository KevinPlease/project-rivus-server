import Controller from "../../network/Controller";
import { MessengerFunction } from "../../Messenger";
import { Dictionary } from "../../types/Dictionary";
import { NotificationRepo } from "../../backend/repos/NotificationRepo";
import { IdentifiableDictionary } from "../../types/IdentifiableDictionary";
import { ListFilter } from "../../backend/types/ListFilter";
import { Notification, NotificationData } from "../../backend/models/Notification";

class NotificationController extends Controller {
	constructor(say: MessengerFunction) {
		super("notification", "notifications", say);
	}

	async post(say: MessengerFunction): Promise<void> {
		const request = this.getActiveRequest<NotificationData>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const domain = this.getOwningDomain(say);
		const branch = this.getOwningBranch(say);
		const repo = NotificationRepo.getInstance(say);
		const notification = Notification.create(say, request.body, { domain: domain.name, branch: branch.data.name });
		const operationStatus = await repo.add(notification, say);

		const content: Dictionary = { notification };
		return response.sendByInfo(operationStatus, content);
	}

	async getMany(say: MessengerFunction): Promise<void> {
		const request = this.getActiveRequest<ListFilter>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const repo = NotificationRepo.getInstance(say);
		const notifications = await repo.detailedGetMany(say, request.query.filter, request.query.pagination);

		response
			.setType("success")
			.content = { notifications };
		return response.send();
	}

	async get(say: MessengerFunction): Promise<void> {
		const request = this.getActiveRequest<IdentifiableDictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const repo = NotificationRepo.getInstance(say);
		const notification = await repo.detailedFindById(request.query.id, say);
		const responseType = notification ? "success" : "notFound";

		response
			.setType(responseType)
			.content = { notification };

		return response.send();
	}

	async put(say: MessengerFunction): Promise<void> {
		const request = this.getActiveRequest<Dictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const repo = NotificationRepo.getInstance(say);
		const operation = await repo.editData(request.body.id, request.body, say);

		return response.sendByInfo(operation.status, operation.message);
	}

	async delete(say: MessengerFunction): Promise<void> {
		const request = this.getActiveRequest<IdentifiableDictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const repo = NotificationRepo.getInstance(say);
		const operationStatus = await repo.remove(request.query.id, say);

		return response.sendByInfo(operationStatus);
	}
}

export default NotificationController;
