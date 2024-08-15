import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { OperationStatus } from "../../types/Operation";
import { UnitExtra, UnitExtraData } from "../models/UnitExtra";
import { BaseRepo } from "./BaseRepo";

class UnitExtraRepo extends BaseRepo<UnitExtraData> {
	public static REPO_NAME = "unitExtras";
	public static MODEL_ROLE_NAME = UnitExtra.ROLE;

	public static create(collection: MongoCollection, domain: string) {
		return new UnitExtraRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain);
	}

	public static getInstance(say: MessengerFunction): UnitExtraRepo {
		return super.getInstance(say) as UnitExtraRepo;
	}

	public async addDefaultData(say: MessengerFunction): Promise<OperationStatus> {
		const count = await this.collection.count({});
		if (count > 0) return "success";

		const data: UnitExtraData[] = [
			{ "name": "Garazhd i hapur", "order": 1 },
			{ "name": "Garazhd i mbyllur", "order": 1 },
			{ "name": "Parkim i jashtem", "order": 1 }
		];
		return this.addMany(data, say);
	}
}

export { UnitExtraRepo };
