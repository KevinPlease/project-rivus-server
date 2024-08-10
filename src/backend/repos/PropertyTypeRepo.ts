import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
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
}

export { PropertyTypeRepo };
