import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { OperationStatus } from "../../types/Operation";
import { Country, CountryData } from "../models/Country";
import { BaseRepo } from "./BaseRepo";

class CountryRepo extends BaseRepo<CountryData> {
	public static REPO_NAME = "countries";
	public static MODEL_ROLE_NAME = Country.ROLE;

	public static create(collection: MongoCollection, domain: string) {
		return new CountryRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain);
	}

	public static getInstance(say: MessengerFunction): CountryRepo {
		return super.getInstance(say) as CountryRepo;
	}

	public async addDefaultData(say: MessengerFunction): Promise<OperationStatus> {
		const count = await this.collection.count({});
		if (count > 0) return "success";

		const data: CountryData[] = [
			{ "name": "Albania", "order": 1 }
		];
		return this.addMany(data, say);
	}
}

export { CountryRepo };
