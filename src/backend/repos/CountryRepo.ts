import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { Dictionary } from "../../types/Dictionary";
import { OperationStatus } from "../../types/Operation";
import { Country, CountryData } from "../models/Country";
import { Filter } from "../types/Filter";
import { PaginationOptions } from "../types/PaginationOptions";
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

	public getSimplifiedMany(say: MessengerFunction, filter?: Filter | Dictionary, pagination?: PaginationOptions, project?: Dictionary): Promise<Dictionary[]> {
		if (!project) project = {};
		
		const overrideProject = { "data.name": 1, "data.code": 1, "data.phone": 1, ...project };
		return super.getSimplifiedMany(say, filter, pagination, overrideProject);;
	}

	public async addDefaultData(say: MessengerFunction): Promise<OperationStatus> {
		const count = await this.collection.count({});
		if (count > 0) return "success";

		const data: CountryData[] = [
			{ "code": "AL", "name": "Albania", "order": 1, "phone": "355" }
		];
		return this.addMany(data, say);
	}
}

export { CountryRepo };
