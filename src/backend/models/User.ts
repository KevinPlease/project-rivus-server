import { MessengerFunction } from "../../Messenger";
import { Model } from "../../core/Model";
import ExObject from "../../shared/Object";
import Metadata from "../../core/types/Metadata";
import OwnershipInfo from "../types/OwnershipInfo";
import { ImageDetails } from "../types/ImageDetails";
import { GenericDictionary } from "../../types/Dictionary";
import { Role } from "./Role";

type BranchRole = GenericDictionary<string>;

type UserPreferences = {};

type UserData = {
	name: string;
	role: Role | null;
	roles: BranchRole;
	images: ImageDetails[];
	email: string;
	username: string;
	password: string;
	phone: string;
	token?: string;
	preferences: UserPreferences;
};

type UserFormDetails = {
	role: any[];
	branch: any[];
}

class User extends Model<UserData> {

	static ROLE = "user";

	static emptyData(): UserData {
		return {
			name: "",
			role: null,
			roles: {},
			images: [],
			username: "",
			email: "",
			password: "",
			phone: "",
			token: "",
			preferences: {}
		};
	}

	public static create(say: MessengerFunction, data: UserData, ownership: OwnershipInfo, meta?: Metadata): User {
		if (ExObject.isDictEmpty(data)) data = User.emptyData();

		if (!ownership.branch) throw "USER: Missing branch from ownership info!";

		// NOTE: cyclic dependency if importing UserRepo, therefore we use direct dependency injection
		const userRepo = say(this, "ask", "repo", "users");
		return User._create(say, data, userRepo.repoName, User.ROLE, ownership, meta);
	}

}

export { User };
export type { UserData, UserFormDetails };
