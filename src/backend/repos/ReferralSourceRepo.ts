import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { BaseRepo } from "./BaseRepo";
import { IRepoOptions } from "../interfaces/IRepository";
import { BrandData, Brand } from "../models/Brand";

class ReferralSourceRepo extends BaseRepo<BrandData> {
	public static REPO_NAME = "referralSources";
	public static MODEL_ROLE_NAME = Brand.ROLE;

	public static create(collection: MongoCollection, domain: string) {
		const options: IRepoOptions = { needsDisplayIds: false };
		return new ReferralSourceRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain, undefined, options);
	}

	public static getInstance(say: MessengerFunction): ReferralSourceRepo {
		return super.getInstance(say) as ReferralSourceRepo;
	}
}

export { ReferralSourceRepo };
