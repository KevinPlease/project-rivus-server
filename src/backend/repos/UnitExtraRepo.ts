import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
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
}

export { UnitExtraRepo };
