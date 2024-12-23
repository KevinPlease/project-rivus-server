import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { Notification, NotificationData } from "../models/Notification";
import { BaseRepo } from "./BaseRepo";
import { IRepoOptions } from "../interfaces/IRepository";
import { ModelCore } from "../../core/Model";
import { PaginationOptions } from "../types/PaginationOptions";
import { Filter } from "../types/Filter";
import IPreferenceMiddleware from "../interfaces/IPreferenceMiddleware";
import PreferenceKeeper from "../middlewares/PreferenceKeeper";
import { EPreferenceType } from "../models/UserPreference";
import MongoQuery, { AggregationInfo } from "../models/MongoQuery";
import PrivilegeKeeper from "../middlewares/PrivilegeKeeper";
import { UserRepo } from "./UserRepo";
import { GenericDictionary, Dictionary } from "../../types/Dictionary";

class NotificationRepo extends BaseRepo<NotificationData> {
	public static REPO_NAME = "notifications";
	public static MODEL_ROLE_NAME = Notification.ROLE;
	private _preferenceMiddleware: IPreferenceMiddleware;

	constructor(collection: MongoCollection, repoName: string, modelRole: string, domain: string, branch?: string, options?: IRepoOptions) {
		super(collection, repoName, modelRole, domain, undefined, options);
		this._preferenceMiddleware = new PreferenceKeeper();
	}

	public static create(collection: MongoCollection, domain: string) {
		const options: IRepoOptions = { needsDisplayIds: true };
		const repo = new NotificationRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain, undefined, options);
		repo.privilegeMiddleware = new PrivilegeKeeper();
		return repo;
	}

	public static getInstance(say: MessengerFunction): NotificationRepo {
		return super.getInstance(say) as NotificationRepo;
	}

	public createAggregation(query: Dictionary, say: MessengerFunction): Dictionary[] {
		const userRepoId = UserRepo.getInstance(say).id;
		const project = {
			"data.name": 1,
			"repository": 1
		};
		const aggInfo: AggregationInfo[] = [
			{
				repoToJoinFrom: userRepoId,
				fieldToSet: "data.content._core.meta.creator",
				project
			},
		];

		const sort = {
			"meta.timeCreated": -1
		};

		return MongoQuery.makeAggregation(aggInfo, query, sort);
	}

	public async getFormDetails(say: MessengerFunction): Promise<GenericDictionary<Dictionary[]>> {
		const userRepo = UserRepo.getInstance(say);
		const user = await userRepo.getSimplifiedMany(say);

		return { user };
	}

	public async getMany(say: MessengerFunction, filter?: Filter | undefined, pagination?: PaginationOptions | undefined): Promise<ModelCore<NotificationData>[]> {
		const userId = say(this, "ask", "ownUserId");
		const preferences = await this._preferenceMiddleware.getPreferencesForAll(userId, EPreferenceType.NOTIFICATIONS, say);
		const query = this.createQueryFromFilter(filter);
		const preferentialQuery = MongoQuery.makePreferentialQuery(preferences, query);
		const aggregation = this.createAggregation(preferentialQuery, say);
		return this._readManyAsAggregation(aggregation, say, pagination);
	}

}

export { NotificationRepo };
