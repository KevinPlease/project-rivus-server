import Controller from "../../network/Controller";
import { MessengerFunction } from "../../Messenger";
import { Dictionary } from "../../types/Dictionary";
import { UserRepo } from "../../backend/repos/UserRepo";
import { IdentifiableDictionary } from "../../types/IdentifiableDictionary";
import { ListFilter } from "../../backend/types/ListFilter";
import { User, UserData } from "../../backend/models/User";
import { Operation } from "../../types/Operation";

class UserController extends Controller {

	constructor(say: MessengerFunction) {
		super("user", "users", say);
	}

	async post(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<UserData>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const domain = this.getOwningDomain(say);
		const branch = this.getOwningBranch(say);
		const userRepo = UserRepo.getInstance(say);
		const user = User.create(say, request.body, { domain: domain.name, branch: branch.data.name });
		const operationStatus = await userRepo.add(user, say);
		if (operationStatus === "failure") return response.sendByInfo(operationStatus);

		const content: Dictionary = { user };
		return response.sendByInfo(operationStatus, content);
	}

	async postImages(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<IdentifiableDictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const userRepo = UserRepo.getInstance(say);
		const files = request.getUploadedFiles(say);
		const operationStatus = await userRepo.setImagesFromFiles(request.body.id, files, say);

		return response.sendByInfo(operationStatus);
	}

	async getMany(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<ListFilter>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const userRepo = UserRepo.getInstance(say);
		const users = await userRepo.detailedGetMany(say, request.query.filter, request.query.pagination);

		response
			.setType("success")
			.content = { users };
		return response.send();
	}

	async get(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<IdentifiableDictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);
		
		const userRepo = UserRepo.getInstance(say);
		const user = await userRepo.detailedFindById(request.query.id, say);
		const responseType = user ? "success" : "notFound";

		response
			.setType(responseType)
			.content = { user };

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

		const userRepo = UserRepo.getInstance(say);
		const imageOperation = await userRepo.getImageById(branchName, request.params.id, request.query.imageId, say);
		if (imageOperation.status === "failure") response.setType("notFound");

		const resType = imageOperation.status === "failure" ? "notFound" : "successFile";
		response
			.setType(resType)
			.content = imageOperation.message;

		return response.send();
	}

	async getForm(say: MessengerFunction) : Promise<void> {
		const response = this.getActiveResponse<Dictionary>(say);
		
		const userRepo = UserRepo.getInstance(say);
		const formDetails = await userRepo.getFormDetails(say);
		const responseType = formDetails ? "success" : "notFound";

		response
			.setType(responseType)
			.content = { formDetails };

		return response.send();
	}

	async put(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<Dictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);
		const userRepo = UserRepo.getInstance(say);

		const reqBody = request.body;
		let operation: Operation = { status: "failure", message: "Bad Request!" };
		if (reqBody.oldPassword && reqBody.newPassword) {
			operation = await userRepo.changePassword(reqBody._id, reqBody.oldPassword, reqBody.newPassword, say);
		} else {
			operation = await userRepo.editData(reqBody._id, reqBody.data, say);
		}
		
		return response.sendByInfo(operation.status, operation.message);
	}

	async delete(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<IdentifiableDictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const userRepo = UserRepo.getInstance(say);
		const operationStatus = await userRepo.remove(request.query.id, say);
		
		return response.sendByInfo(operationStatus);
	}

}

export default UserController;
