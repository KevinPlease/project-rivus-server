import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { Category, CategoryData } from "../models/Category";
import { BaseRepo } from "./BaseRepo";
import { IRepoOptions } from "../interfaces/IRepository";

class CategoryRepo extends BaseRepo<CategoryData> {
	public static REPO_NAME = "categories";
	public static MODEL_ROLE_NAME = Category.ROLE;

	public static create(collection: MongoCollection, domain: string) {
		const options: IRepoOptions = { needsDisplayIds: false };
		return new CategoryRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain, undefined, options);
	}

	public static getInstance(say: MessengerFunction): CategoryRepo {
		return super.getInstance(say) as CategoryRepo;
	}
}

export { CategoryRepo };
