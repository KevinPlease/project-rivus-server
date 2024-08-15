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
		super("user", say);
	}

	async postAuthUser(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<Dictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);
		
		const msngr = (source: Object, purpose: string, what: string, content?: any): any => {
			if (purpose === "ask" && what === "isSysCall") return true;

			return say(source, purpose, what, content);
		};
		const userRepo = UserRepo.getInstance(say);
		const authOperation = await userRepo.authUser(request.body.username, request.body.password, msngr);
		
		return response.sendByInfo(authOperation.status, authOperation.message);
	}

	async putAuthUser(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<Dictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);
		const userRepo = UserRepo.getInstance(say);

		let reqBody = request.body;
		const userId = this.getOwningUserId(say);
		
		let authOperation: Operation = { status: "failure", message: "Bad Request!" };
		if (reqBody.oldPassword && reqBody.newPassword) {
			authOperation = await userRepo.changePassword(userId, reqBody.oldPassword, reqBody.newPassword, say);
		} else {
			const userData = reqBody as UserData;
			authOperation = await userRepo.editData(userId, userData, say);
		}
		
		return response.sendByInfo(authOperation.status, authOperation.message);
	}

	async getAuthUser(say: MessengerFunction) : Promise<void> {
		const request = this.getActiveRequest<Dictionary>(say);
		const response = this.getActiveResponse<Dictionary>(say);

		const msngr = (source: Object, purpose: string, what: string, content?: any): any => {
			if (purpose === "ask" && what === "isSysCall") return true;

			return say(source, purpose, what, content);
		};
		const userRepo = UserRepo.getInstance(say);
		const user = await userRepo.findUserByToken(request.query.token, msngr);
		
		const authOperation: Operation = { status: "failure", message: "There was a problem with your request!" };
		
		if (user) {
			authOperation.status = "success";
			authOperation.message = { user };
		}

		return response.sendByInfo(authOperation.status, authOperation.message);
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

		const content: Dictionary = {}; 
		if (request.query.isDraft) {
			const userContent = { formDetails: {}, model: {} };
			userContent.formDetails = await userRepo.getFormDetails(say);
			userContent.model = user;
			content.user = userContent;
		} else {
			content.user = user;
		}

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

	async getDraft(say: MessengerFunction) : Promise<void> {
		const response = this.getActiveResponse<Dictionary>(say);
		
		const userRepo = UserRepo.getInstance(say);
		const user = await userRepo.findDraft(say);
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
		const userId = this.getOwningUserId(say);
		
		let operation: Operation = { status: "failure", message: "Bad Request!" };
		if (reqBody.oldPassword && reqBody.newPassword) {
			operation = await userRepo.changePassword(userId, reqBody.oldPassword, reqBody.newPassword, say);
		} else {
			const userData = reqBody as UserData;
			operation = await userRepo.editData(userId, userData, say);
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
