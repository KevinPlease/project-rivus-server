import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { Dictionary, GenericDictionary } from "../../types/Dictionary";
import { IRepoOptions } from "../interfaces/IRepository";
import PrivilegeKeeper from "../middlewares/PrivilegeKeeper";
import MongoQuery, { AggregationInfo } from "../models/MongoQuery";
import { Property, PropertyData } from "../models/Property";
import { DetailedFind } from "../types/DetailedFind";
import { BaseDocimgRepo } from "./BaseDocRepo";
import { BuilderRepo } from "./BuilderRepo";
import { CityRepo } from "./CityRepo";
import { ConstructionStageRepo } from "./ConstructionStageRepo";
import { CountryRepo } from "./CountryRepo";
import { PropertyTypeRepo } from "./PropertyTypeRepo";
import { UserRepo } from "./UserRepo";


class PropertyRepo extends BaseDocimgRepo<PropertyData> {
	public static REPO_NAME = "properties";
	public static MODEL_ROLE_NAME = Property.ROLE;

	public static create(collection: MongoCollection, domain: string) {
		const options: IRepoOptions = { needsDisplayIds: true, needsDraftModels: true };
		const repo = new PropertyRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain, undefined, options);
		
		repo.middleware = new PrivilegeKeeper();

		return repo;
	}

	public static getInstance(say: MessengerFunction): PropertyRepo {
		return super.getInstance(say) as PropertyRepo;
	}

	public createAggregation(query: Dictionary, say: MessengerFunction): Dictionary[] {
		const userRepoId = UserRepo.getInstance(say).id;
		const propertyTypeRepoId = PropertyTypeRepo.getInstance(say).id;
		const constructionStageRepoId = ConstructionStageRepo.getInstance(say).id;
		const countryRepoId = CountryRepo.getInstance(say).id;
		const cityRepoId = CityRepo.getInstance(say).id;
		const builderRepoId = BuilderRepo.getInstance(say).id;
		// TODO: Once all repos are available
		const project = {
			"data.name": 1,
			"repository": 1
		};
		const aggInfo : AggregationInfo[] = [
			{
				repoToJoinFrom: userRepoId,
				fieldToSet: "data.assignee",
				project
			},
			{
				repoToJoinFrom: propertyTypeRepoId,
				fieldToSet: "data.propertyType",
				project
			},
			{
				repoToJoinFrom: constructionStageRepoId,
				fieldToSet: "data.constructionStage",
				project
			},
			{
				repoToJoinFrom: countryRepoId,
				fieldToSet: "data.country",
				project
			},
			{
				repoToJoinFrom: cityRepoId,
				fieldToSet: "data.city",
				project
			},
			{
				repoToJoinFrom: builderRepoId,
				fieldToSet: "data.builder",
				project
			}
		];

		const sort = {
			"meta.timeCreated": -1
		};

		return MongoQuery.makeAggregation(aggInfo, query, sort);
	}

	public async getFormDetails(say: MessengerFunction): Promise<GenericDictionary<Dictionary[]>> {
		const userRepo = UserRepo.getInstance(say);
		const assignee = await userRepo.getSimplifiedMany(say);

		const propertyTypeRepo = PropertyRepo.getInstance(say);
		const propertyType = await propertyTypeRepo.getSimplifiedMany(say);

		const constructionStageRepo = ConstructionStageRepo.getInstance(say);
		const constructionStage = await constructionStageRepo.getSimplifiedMany(say);

		const countryRepo = CountryRepo.getInstance(say);
		const country = await countryRepo.getSimplifiedMany(say);

		const cityRepo = CityRepo.getInstance(say);
		const city = await cityRepo.getSimplifiedMany(say);

		const builderRepo = BuilderRepo.getInstance(say);
		const builder = await builderRepo.getSimplifiedMany(say);

		return { assignee, propertyType, constructionStage, country, city, builder };
	}

	public async detailedFind(query: Dictionary, say: MessengerFunction): Promise<DetailedFind<Property> | null> {
		const aggregation = this.createAggregation(query, say);
		const modelCore = await this._readAsAggregation(aggregation, say);
		if (!modelCore) return null;

		const model = new Property(modelCore);
		const formDetails = await this.getFormDetails(say);
		return { formDetails, model };
	}

}

export { PropertyRepo };
