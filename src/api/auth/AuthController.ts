import Controller from "../../network/Controller";
import { MessengerFunction } from "../../Messenger";
import { Dictionary } from "../../types/Dictionary";
import { UserRepo } from "../../backend/repos/UserRepo";
import { Operation } from "../../types/Operation";

class AuthController extends Controller {

	constructor(say: MessengerFunction) {
		super("auth", "auth", say);
	}

	async post(say: MessengerFunction) : Promise<void> {
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

	async getUser(say: MessengerFunction) : Promise<void> {
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

}

export default AuthController;
