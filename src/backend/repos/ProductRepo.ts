import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { Product, ProductData } from "../models/Product";
import { BaseRepo } from "./BaseRepo";
import { IRepoOptions } from "../interfaces/IRepository";
import { CategoryRepo } from "./CategoryRepo";
import { BrandRepo } from "./BrandRepo";
import { ColorRepo } from "./ColorRepo";
import { CityRepo } from "./CityRepo";
import { Dictionary, GenericDictionary } from "../../types/Dictionary";
import MongoQuery, { AggregationInfo } from "../models/MongoQuery";

class ProductRepo extends BaseRepo<ProductData> {
	public static REPO_NAME = "products";
	public static MODEL_ROLE_NAME = Product.ROLE;

	public static create(collection: MongoCollection, domain: string) {
		const options: IRepoOptions = { needsDisplayIds: true };
		return new ProductRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain, undefined, options);
	}

	public static getInstance(say: MessengerFunction): ProductRepo {
		return super.getInstance(say) as ProductRepo;
	}

	public createAggregation(query: Dictionary, say: MessengerFunction): Dictionary[] {
		const categoryRepoId = CategoryRepo.getInstance(say).id;
		const brandRepoId = BrandRepo.getInstance(say).id;
		const colorRepoId = ColorRepo.getInstance(say).id;
		const cityRepoId = CityRepo.getInstance(say).id;

		const project = {
			"data.name": 1,
			"repository": 1,
		};

		const aggInfo: AggregationInfo[] = [
			{
				repoToJoinFrom: categoryRepoId,
				fieldToSet: "data.category",
				project,
			},
			{
				repoToJoinFrom: brandRepoId,
				fieldToSet: "data.brand",
				project,
			},
			{
				repoToJoinFrom: colorRepoId,
				fieldToSet: "data.color",
				project,
			},
			{
				repoToJoinFrom: cityRepoId,
				fieldToSet: "data.city",
				project,
			},
		];

		const sort = {
			"meta.timeCreated": -1,
		};

		return MongoQuery.makeAggregation(aggInfo, query, sort);
	}

	public async getFormDetails(say: MessengerFunction): Promise<GenericDictionary<Dictionary[]>> {
		const categoryRepo = CategoryRepo.getInstance(say);
		const categories = await categoryRepo.getSimplifiedMany(say);
		const brandRepo = BrandRepo.getInstance(say);
		const brands = await brandRepo.getSimplifiedMany(say);
		const colorRepo = ColorRepo.getInstance(say);
		const colors = await colorRepo.getSimplifiedMany(say);
		const cityRepo = CityRepo.getInstance(say);
		const cities = await cityRepo.getSimplifiedMany(say);

		return { categories, brands, colors, cities };
	}
}

export { ProductRepo };
