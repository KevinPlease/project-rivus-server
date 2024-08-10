import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { Builder, BuilderData } from "../models/Builder";
import { BaseRepo } from "./BaseRepo";

class BuilderRepo extends BaseRepo<BuilderData> {
	public static REPO_NAME = "builders";
	public static MODEL_ROLE_NAME = Builder.ROLE;

	public static create(collection: MongoCollection, domain: string) {
		return new BuilderRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain);
	}

	public static getInstance(say: MessengerFunction): BuilderRepo {
		return super.getInstance(say) as BuilderRepo;
	}
}

export { BuilderRepo };
