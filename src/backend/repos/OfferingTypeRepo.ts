import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { OperationStatus } from "../../types/Operation";
import { OfferingType, OfferingTypeData } from "../models/OfferingType";
import { BaseRepo } from "./BaseRepo";

class OfferingTypeRepo extends BaseRepo<OfferingTypeData> {
	public static REPO_NAME = "offeringTypes";
	public static MODEL_ROLE_NAME = OfferingType.ROLE;

	public static create(collection: MongoCollection, domain: string) {
		return new OfferingTypeRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain);
	}

	public static getInstance(say: MessengerFunction): OfferingTypeRepo {
		return super.getInstance(say) as OfferingTypeRepo;
	}

	public async addDefaultData(say: MessengerFunction): Promise<OperationStatus> {
		const count = await this.collection.count({});
		if (count > 0) return "success";

		const data: OfferingTypeData[] = [
			{ "name": "Per Shitje", "order": 1 },
			{ "name": "Per Qeradhenie", "order": 1 }
		];
		return this.addMany(data, say);
	}
}

export { OfferingTypeRepo };
