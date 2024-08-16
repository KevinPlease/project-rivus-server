import Controller from "../../network/Controller";
import { MessengerFunction } from "../../Messenger";
import { Dictionary } from "../../types/Dictionary";
import { CustomerRepo } from "../../backend/repos/CustomerRepo";
import { IdentifiableDictionary } from "../../types/IdentifiableDictionary";
import { ListFilter } from "../../backend/types/ListFilter";
import { Customer, CustomerData } from "../../backend/models/Customer";
import { Operation } from "../../types/Operation";

class CustomerController extends Controller {

	constructor(say: MessengerFunction) {
		super("customer", "customers", say);
	}

	async post(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<CustomerData>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const domain = this.getOwningDomain(say);
		const branch = this.getOwningBranch(say);
		const repo = CustomerRepo.getInstance(say);
		const customer = Customer.create(say, request.body, { domain: domain.name, branch: branch.data.name });
		const operationStatus = await repo.add(customer, say);
		if (operationStatus === "failure") return response.sendByInfo(operationStatus);

		const content: Dictionary = {}; 
		if (request.query.isDraft) {
			const userContent = { formDetails: {}, model: {} };
			userContent.formDetails = await repo.getFormDetails(say);
			userContent.model = customer;
			content.customer = userContent;
		} else {
			content.customer = customer;
		}

		return response.sendByInfo(operationStatus, content);
	}

	async postDocuments(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<IdentifiableDictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const repo = CustomerRepo.getInstance(say);
		const files = request.getUploadedFiles(say);
		const operationStatus = await repo.setDocumentsFromFiles(request.body.id, files, say);

		return response.sendByInfo(operationStatus);
	}

	async getMany(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<ListFilter>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const repo = CustomerRepo.getInstance(say);
		const customers = await repo.detailedGetMany(say, request.query.filter, request.query.pagination);

		response
			.setType("success")
			.content = { customers };
		return response.send();
	}

	async get(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<IdentifiableDictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);
		
		const repo = CustomerRepo.getInstance(say);
		const customer = await repo.detailedFindById(request.query.id, say);
		const responseType = customer ? "success" : "notFound";

		response
			.setType(responseType)
			.content = { customer };

		return response.send();
	}

	async getDraft(say: MessengerFunction) : Promise<void> {
		const response = this.getActiveResponse<Dictionary>(say);
		
		const repo = CustomerRepo.getInstance(say);
		const customer = await repo.findDraft(say);
		const responseType = customer ? "success" : "notFound";

		response
			.setType(responseType)
			.content = { customer };

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

		const repo = CustomerRepo.getInstance(say);
		const operation = await repo.getDocumentById(branchName, request.params.id, request.query.documentId, say);
		if (operation.status === "failure") response.setType("notFound");

		const resType = operation.status === "failure" ? "notFound" : "successFile";
		response
			.setType(resType)
			.content = operation.message;

		return response.send();
	}

	async getForm(say: MessengerFunction) : Promise<void> {
		const response = this.getActiveResponse<Dictionary>(say);
		
		const repo = CustomerRepo.getInstance(say);
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
		
		const repo = CustomerRepo.getInstance(say);
		const operation = await repo.editData(request.body._id, request.body.data, say);
		
		return response.sendByInfo(operation.status, operation.message);
	}

	async delete(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<IdentifiableDictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const repo = CustomerRepo.getInstance(say);
		const operationStatus = await repo.remove(request.query.id, say);
		
		return response.sendByInfo(operationStatus);
	}

}

export default CustomerController;
