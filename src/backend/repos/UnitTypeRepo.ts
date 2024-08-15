import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { OperationStatus } from "../../types/Operation";
import { UnitType, UnitTypeData } from "../models/UnitType";
import { BaseRepo } from "./BaseRepo";

class UnitTypeRepo extends BaseRepo<UnitTypeData> {
	public static REPO_NAME = "unitTypes";
	public static MODEL_ROLE_NAME = UnitType.ROLE;

	public static create(collection: MongoCollection, domain: string) {
		return new UnitTypeRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain);
	}

	public static getInstance(say: MessengerFunction): UnitTypeRepo {
		return super.getInstance(say) as UnitTypeRepo;
	}

	public async addDefaultData(say: MessengerFunction): Promise<OperationStatus> {
		const count = await this.collection.count({});
		if (count > 0) return "success";

		const data: UnitTypeData[] = [
			{ "name": "Apartament", "order": 1 },
			{ "name": "Vile", "order": 1 },
			{ "name": "Dupleks", "order": 1 }
		];
		return this.addMany(data, say);
	}
}

export { UnitTypeRepo };
