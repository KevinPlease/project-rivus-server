import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { Country, CountryData } from "../models/Country";
import { BaseRepo } from "./BaseRepo";
import { IRepoOptions } from "../interfaces/IRepository";

class CountryRepo extends BaseRepo<CountryData> {
	public static REPO_NAME = "countries";
	public static MODEL_ROLE_NAME = Country.ROLE;

	public static create(collection: MongoCollection, domain: string) {
		const options: IRepoOptions = { needsDisplayIds: false };
		return new CountryRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain, undefined, options);
	}

	public static getInstance(say: MessengerFunction): CountryRepo {
		return super.getInstance(say) as CountryRepo;
	}
}

export { CountryRepo };
