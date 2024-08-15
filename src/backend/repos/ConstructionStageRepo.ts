import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { OperationStatus } from "../../types/Operation";
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

	public async addDefaultData(say: MessengerFunction): Promise<OperationStatus> {
		const count = await this.collection.count({});
		if (count > 0) return "success";

		const data: ConstructionStageData[] = [
			{ "name": "Planifikim", "order": 1 },
			{ "name": "Ndertim", "order": 1 },
			{ "name": "Kolaudim", "order": 1 },
			{ "name": "Perfunduar", "order": 1 }
		];
		return this.addMany(data, say);
	}
}

export { ConstructionStageRepo };
