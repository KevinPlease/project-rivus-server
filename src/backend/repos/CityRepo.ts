import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { OperationStatus } from "../../types/Operation";
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

	public async addDefaultData(say: MessengerFunction): Promise<OperationStatus> {
		const count = await this.collection.count({});
		if (count > 0) return "success";

		const data: CityData[] = [
			{ "name": "Tirana", "country": "Albania", "order": 1 },
			{ "name": "Durres", "country": "Albania", "order": 2 },
			{ "name": "Vlore", "country": "Albania", "order": 3 },
			{ "name": "Shkoder", "country": "Albania", "order": 4 },
			{ "name": "Fier", "country": "Albania", "order": 5 },
			{ "name": "Korce", "country": "Albania", "order": 6 },
			{ "name": "Elbasan", "country": "Albania", "order": 7 },
			{ "name": "Berat", "country": "Albania", "order": 8 },
			{ "name": "Lushnje", "country": "Albania", "order": 9 },
			{ "name": "Gjirokaster", "country": "Albania", "order": 10 }
		];
		return this.addMany(data, say);
	}
}

export { CityRepo };
