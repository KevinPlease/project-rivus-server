import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
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
}

export { OfferingTypeRepo };
