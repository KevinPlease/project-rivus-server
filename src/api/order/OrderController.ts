import Controller from "../../network/Controller";
import { MessengerFunction } from "../../Messenger";
import { Dictionary } from "../../types/Dictionary";
import { OrderRepo } from "../../backend/repos/OrderRepo";
import { IdentifiableDictionary } from "../../types/IdentifiableDictionary";
import { ListFilter } from "../../backend/types/ListFilter";
import { Order, OrderData } from "../../backend/models/Order";

class OrderController extends Controller {

	constructor(say: MessengerFunction) {
		super("orders", say);
	}

	async postOrder(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<OrderData>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const domain = this.getOwningDomain(say);
		const branch = this.getOwningBranch(say);
		const repo = OrderRepo.getInstance(say);
		const orders = Order.create(say, request.body, { domain: domain.name, branch: branch.data.name });
		const operationStatus = await repo.add(orders, say);
		if (operationStatus === "failure") return response.sendByInfo(operationStatus);

		const content: Dictionary = {}; 
		if (request.query.isDraft) {
			const userContent = { formDetails: {}, model: {} };
			userContent.formDetails = await repo.getFormDetails(say);
			userContent.model = orders;
			content.orders = userContent;
		} else {
			content.orders = orders;
		}

		return response.sendByInfo(operationStatus, content);
	}

	async postImagesOrder(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<IdentifiableDictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const repo = OrderRepo.getInstance(say);
		const files = request.getUploadedFiles(say);
		const operationStatus = await repo.setImagesFromFiles(request.body.id, files, say);

		return response.sendByInfo(operationStatus);
	}

	async getOrders(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<ListFilter>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const repo = OrderRepo.getInstance(say);
		const users = await repo.detailedGetMany(say, request.query.filter, request.query.pagination);

		response
			.setType("success")
			.content = { users };
		return response.send();
	}

	async getOrder(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<IdentifiableDictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);
		
		const repo = OrderRepo.getInstance(say);
		const orders = await repo.detailedFindById(request.query.id, say);
		const responseType = orders ? "success" : "notFound";

		response
			.setType(responseType)
			.content = { orders };

		return response.send();
	}

	async getDraftOrder(say: MessengerFunction) : Promise<void> {
		const response = this.getActiveResponse<Dictionary>(say);
		
		const repo = OrderRepo.getInstance(say);
		const orders = await repo.findDraft(say);
		const responseType = orders ? "success" : "notFound";

		response
			.setType(responseType)
			.content = { orders };

		return response.send();
	}

	async getImageOrder(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<Dictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);
		
		const branchName = request.query.branch;
		if (!branchName) return response.setType("badRequest").send();
		
		const domain = this.getOwningDomain(say);
		const branch = domain.getBranchByName(branchName);
		if (!branch) return response.setType("badRequest").send();

		const repo = OrderRepo.getInstance(say);
		const imageOperation = await repo.getImageById(branchName, request.params.id, request.query.imageId, say);
		if (imageOperation.status === "failure") response.setType("notFound");

		const resType = imageOperation.status === "failure" ? "notFound" : "successFile";
		response
			.setType(resType)
			.content = imageOperation.message;

		return response.send();
	}

	async getFormOrder(say: MessengerFunction) : Promise<void> {
		const response = this.getActiveResponse<Dictionary>(say);
		
		const repo = OrderRepo.getInstance(say);
		const formDetails = await repo.getFormDetails(say);
		const responseType = formDetails ? "success" : "notFound";

		response
			.setType(responseType)
			.content = { formDetails };

		return response.send();
	}

	async putOrder(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<Dictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);
		const repo = OrderRepo.getInstance(say);

		const userId = this.getOwningUserId(say);
		const userData = request.body as OrderData;
		const operation = await repo.editData(userId, userData, say);
		
		return response.sendByInfo(operation.status, operation.message);
	}

	async deleteOrder(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<IdentifiableDictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const repo = OrderRepo.getInstance(say);
		const operationStatus = await repo.remove(request.query.id, say);
		
		return response.sendByInfo(operationStatus);
	}

}

export default OrderController;
