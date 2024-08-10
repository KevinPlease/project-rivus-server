import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { Dictionary, GenericDictionary } from "../../types/Dictionary";
import IRepoMiddleware from "../interfaces/IRepoMiddleware";
import PrivilegeKeeper from "../middlewares/PrivilegeKeeper";
import MongoQuery, { AggregationInfo } from "../models/MongoQuery";
import { Customer, CustomerData } from "../models/Customer";
import { DetailedFind } from "../types/DetailedFind";
import { BaseDocimgRepo } from "./BaseDocRepo";
import { BranchRepo } from "./BranchRepo";
import { RoleRepo } from "./RoleRepo";


class CustomerRepo extends BaseDocimgRepo<CustomerData> {
	public static REPO_NAME = "customers";
	public static MODEL_ROLE_NAME = Customer.ROLE;

	private _middleware?: IRepoMiddleware;

	public static create(collection: MongoCollection, domain: string, branch: string) {
		const repo = new CustomerRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain, branch);
		
		repo._middleware = new PrivilegeKeeper();

		return repo;
	}

	public static getInstance(say: MessengerFunction): CustomerRepo {
		return super.getInstance(say) as CustomerRepo;
	}

	public createAggregation(query: Dictionary, say: MessengerFunction): Dictionary[] {
		const roleRepoId = RoleRepo.getInstance(say).id;
		const project = {
			"data.name": 1,
			"repository": 1
		};
		const aggInfo : AggregationInfo[] = [
			{
				repoToJoinFrom: roleRepoId,
				fieldToSet: "data.role",
				project
			},
		];

		const sort = {
			"meta.timeCreated": -1
		};

		return MongoQuery.makeAggregation(aggInfo, query, sort);
	}

	public async getFormDetails(say: MessengerFunction): Promise<GenericDictionary<Dictionary[]>> {
		const roleRepo = RoleRepo.getInstance(say);
		const role = await roleRepo.getSimplifiedMany(say);
		
		const branchRepo = BranchRepo.getInstance(say);
		const branch = await branchRepo.getSimplifiedMany(say);

		return { branch, role };
	}

	public async detailedFind(query: Dictionary, say: MessengerFunction): Promise<DetailedFind<Customer> | null> {
		const aggregation = this.createAggregation(query, say);
		const modelCore = await this._readAsAggregation(aggregation, say);
		if (!modelCore) return null;

		// TODO: Aggregation for data.roles not adapted/accounted for.
		const model = new Customer(modelCore);
		const formDetails = await this.getFormDetails(say);
		return { formDetails, model };
	}

}

export { CustomerRepo };
