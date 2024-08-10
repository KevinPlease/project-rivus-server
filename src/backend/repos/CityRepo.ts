import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { City, CityData } from "../models/City";
import { BaseRepo } from "./BaseRepo";

class CityRepo extends BaseRepo<CityData> {
	public static REPO_NAME = "cities";
	public static MODEL_ROLE_NAME = City.ROLE;

	public static create(collection: MongoCollection, domain: string) {
		return new CityRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain);
	}

	public static getInstance(say: MessengerFunction): CityRepo {
		return super.getInstance(say) as CityRepo;
	}
}

export { CityRepo };
