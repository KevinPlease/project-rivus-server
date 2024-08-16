import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { Dictionary, GenericDictionary } from "../../types/Dictionary";
import PrivilegeKeeper from "../middlewares/PrivilegeKeeper";
import MongoQuery, { AggregationInfo } from "../models/MongoQuery";
import { Customer, CustomerData } from "../models/Customer";
import { DetailedFind } from "../types/DetailedFind";
import { BaseDocimgRepo } from "./BaseDocRepo";
import { UserRepo } from "./UserRepo";
import { IRepoOptions } from "../interfaces/IRepository";


class CustomerRepo extends BaseDocimgRepo<CustomerData> {
	public static REPO_NAME = "customers";
	public static MODEL_ROLE_NAME = Customer.ROLE;

	public static create(collection: MongoCollection, domain: string) {
		const options: IRepoOptions = { needsDisplayIds: true, needsDraftModels: true };
		const repo = new CustomerRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain, undefined, options);
		
		repo.middleware = new PrivilegeKeeper();

		return repo;
	}

	public static getInstance(say: MessengerFunction): CustomerRepo {
		return super.getInstance(say) as CustomerRepo;
	}

	public createAggregation(query: Dictionary, say: MessengerFunction): Dictionary[] {
		const userRepoId = UserRepo.getInstance(say).id;
		const project = {
			"data.name": 1,
			"repository": 1
		};
		const aggInfo : AggregationInfo[] = [
			{
				repoToJoinFrom: userRepoId,
				fieldToSet: "data.assignee",
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

	public async detailedFind(query: Dictionary, say: MessengerFunction): Promise<DetailedFind<Customer> | null> {
		const aggregation = this.createAggregation(query, say);
		const modelCore = await this._readAsAggregation(aggregation, say);
		if (!modelCore) return null;

		const model = new Customer(modelCore);
		const formDetails = await this.getFormDetails(say);
		return { formDetails, model };
	}

}

export { CustomerRepo };
