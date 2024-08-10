import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { Dictionary, GenericDictionary } from "../../types/Dictionary";
import IRepoMiddleware from "../interfaces/IRepoMiddleware";
import { IRepoOptions } from "../interfaces/IRepository";
import PrivilegeKeeper from "../middlewares/PrivilegeKeeper";
import MongoQuery, { AggregationInfo } from "../models/MongoQuery";
import { Order, OrderData } from "../models/Order";
import { DetailedFind } from "../types/DetailedFind";
import { BaseDocimgRepo } from "./BaseDocRepo";
import { CustomerRepo } from "./CustomerRepo";
import { UserRepo } from "./UserRepo";


class OrderRepo extends BaseDocimgRepo<OrderData> {
	public static REPO_NAME = "orders";
	public static MODEL_ROLE_NAME = Order.ROLE;

	private _middleware?: IRepoMiddleware;

	public static create(collection: MongoCollection, domain: string) {
		const options: IRepoOptions = { needsDisplayIds: true, needsDraftModels: true };
		const repo = new OrderRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain, undefined, options);
		
		repo._middleware = new PrivilegeKeeper();

		return repo;
	}

	public static getInstance(say: MessengerFunction): OrderRepo {
		return super.getInstance(say) as OrderRepo;
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
				fieldToSet: "data.customer",
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

		const customerRepo = CustomerRepo.getInstance(say);
		const customer = await customerRepo.getSimplifiedMany(say);
		return { assignee, customer };
	}

	public async detailedFind(query: Dictionary, say: MessengerFunction): Promise<DetailedFind<Order> | null> {
		const aggregation = this.createAggregation(query, say);
		const modelCore = await this._readAsAggregation(aggregation, say);
		if (!modelCore) return null;

		const model = new Order(modelCore);
		const formDetails = await this.getFormDetails(say);
		return { formDetails, model };
	}

}

export { OrderRepo };
