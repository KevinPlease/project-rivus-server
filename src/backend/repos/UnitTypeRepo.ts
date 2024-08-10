import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
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
}

export { UnitTypeRepo };
