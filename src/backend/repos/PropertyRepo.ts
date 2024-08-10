import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { Dictionary, GenericDictionary } from "../../types/Dictionary";
import IRepoMiddleware from "../interfaces/IRepoMiddleware";
import { IRepoOptions } from "../interfaces/IRepository";
import PrivilegeKeeper from "../middlewares/PrivilegeKeeper";
import MongoQuery, { AggregationInfo } from "../models/MongoQuery";
import { Property, PropertyData } from "../models/Property";
import { DetailedFind } from "../types/DetailedFind";
import { BaseDocimgRepo } from "./BaseDocRepo";
import { CustomerRepo } from "./CustomerRepo";
import { UserRepo } from "./UserRepo";


class PropertyRepo extends BaseDocimgRepo<PropertyData> {
	public static REPO_NAME = "properties";
	public static MODEL_ROLE_NAME = Property.ROLE;

	private _middleware?: IRepoMiddleware;

	public static create(collection: MongoCollection, domain: string) {
		const options: IRepoOptions = { needsDisplayIds: true, needsDraftModels: true };
		const repo = new PropertyRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain, undefined, options);
		
		repo._middleware = new PrivilegeKeeper();

		return repo;
	}

	public static getInstance(say: MessengerFunction): PropertyRepo {
		return super.getInstance(say) as PropertyRepo;
	}

	public createAggregation(query: Dictionary, say: MessengerFunction): Dictionary[] {
		const userRepoId = UserRepo.getInstance(say).id;
		const customerRepoId = CustomerRepo.getInstance(say).id;
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
				repoToJoinFrom: customerRepoId,
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
		return { assignee };
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
