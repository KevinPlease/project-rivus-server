import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { Brand, BrandData } from "../models/Brand";
import { BaseRepo } from "./BaseRepo";
import { IRepoOptions } from "../interfaces/IRepository";

class BrandRepo extends BaseRepo<BrandData> {
	public static REPO_NAME = "brands";
	public static MODEL_ROLE_NAME = Brand.ROLE;

	public static create(collection: MongoCollection, domain: string) {
		const options: IRepoOptions = { needsDisplayIds: false };
		return new BrandRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain, undefined, options);
	}

	public static getInstance(say: MessengerFunction): BrandRepo {
		return super.getInstance(say) as BrandRepo;
	}
}

export { BrandRepo };
