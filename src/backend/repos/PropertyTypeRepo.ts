import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { OperationStatus } from "../../types/Operation";
import { PropertyType, PropertyTypeData } from "../models/PropertyType";
import { BaseRepo } from "./BaseRepo";

class PropertyTypeRepo extends BaseRepo<PropertyTypeData> {
	public static REPO_NAME = "propertyTypes";
	public static MODEL_ROLE_NAME = PropertyType.ROLE;

	public static create(collection: MongoCollection, domain: string) {
		return new PropertyTypeRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain);
	}

	public static getInstance(say: MessengerFunction): PropertyTypeRepo {
		return super.getInstance(say) as PropertyTypeRepo;
	}

	public async addDefaultData(say: MessengerFunction): Promise<OperationStatus> {
		const count = await this.collection.count({});
		if (count > 0) return "success";

		const data: PropertyTypeData[] = [
			{ "name": "Kompleks/Rezidence", "order": 1 },
			{ "name": "Vile", "order": 1 },
			{ "name": "Pallat", "order": 1 }
		];
		return this.addMany(data, say);
	}
}

export { PropertyTypeRepo };
