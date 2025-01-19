import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { Color, ColorData } from "../models/Color";
import { BaseRepo } from "./BaseRepo";
import { IRepoOptions } from "../interfaces/IRepository";

class ColorRepo extends BaseRepo<ColorData> {
	public static REPO_NAME = "colors";
	public static MODEL_ROLE_NAME = Color.ROLE;

	public static create(collection: MongoCollection, domain: string) {
		const options: IRepoOptions = { needsDisplayIds: false };
		return new ColorRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain, undefined, options);
	}

	public static getInstance(say: MessengerFunction): ColorRepo {
		return super.getInstance(say) as ColorRepo;
	}
}

export { ColorRepo };
