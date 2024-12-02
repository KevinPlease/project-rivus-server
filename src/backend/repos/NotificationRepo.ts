import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { Notification, NotificationData } from "../models/Notification";
import { BaseRepo } from "./BaseRepo";
import { IRepoOptions } from "../interfaces/IRepository";
import { ModelCore } from "../../core/Model";
import { Dictionary } from "../../types/Dictionary";
import { DetailedGetMany } from "../types/DetailedFind";
import { PaginationOptions } from "../types/PaginationOptions";
import { Filter } from "../types/Filter";
import IPreferenceMiddleware from "../interfaces/IPreferenceMiddleware";
import PreferenceKeeper from "../middlewares/PreferenceKeeper";
import { EPreferenceType } from "../models/UserPreference";
import MongoQuery from "../models/MongoQuery";

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
        return new NotificationRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain, undefined, options);
    }

    public static getInstance(say: MessengerFunction): NotificationRepo {
        return super.getInstance(say) as NotificationRepo;
    }

    public async getMany(say: MessengerFunction, filter?: Filter | undefined, pagination?: PaginationOptions | undefined): Promise<ModelCore<NotificationData>[]> {
        const userId = say(this, "ask", "userId");
        const preferences = await this._preferenceMiddleware.getPreferencesForModel(this.modelRole, userId, EPreferenceType.NOTIFICATIONS, say);
		const query = this.createQueryFromFilter(filter);
        const preferentialQuery = MongoQuery.makePreferentialQuery(preferences, query);
		const aggregation = this.createAggregation(preferentialQuery, say);
		return this._readManyAsAggregation(aggregation, say, pagination);
	}

}

export { NotificationRepo };
