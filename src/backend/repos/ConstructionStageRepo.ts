import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { ConstructionStage, ConstructionStageData } from "../models/ConstructionStage";
import { BaseRepo } from "./BaseRepo";

class ConstructionStageRepo extends BaseRepo<ConstructionStageData> {
	public static REPO_NAME = "constructionStages";
	public static MODEL_ROLE_NAME = ConstructionStage.ROLE;

	public static create(collection: MongoCollection, domain: string) {
		return new ConstructionStageRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain);
	}

	public static getInstance(say: MessengerFunction): ConstructionStageRepo {
		return super.getInstance(say) as ConstructionStageRepo;
	}
}

export { ConstructionStageRepo };
