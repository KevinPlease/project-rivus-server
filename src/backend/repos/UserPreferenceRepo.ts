import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { UserPreference, UserPreferenceData } from "../models/UserPreference";
import { BaseRepo } from "./BaseRepo";
import { IRepoOptions } from "../interfaces/IRepository";
import { Dictionary, GenericDictionary } from "../../types/Dictionary";
import MongoQuery, { AggregationInfo } from "../models/MongoQuery";
import { UserRepo } from "./UserRepo";

class UserPreferenceRepo extends BaseRepo<UserPreferenceData> {
    public static REPO_NAME = "userPreferences";
    public static MODEL_ROLE_NAME = UserPreference.ROLE;

    public static create(collection: MongoCollection, domain: string) {
        const options: IRepoOptions = { needsDisplayIds: true };
        return new UserPreferenceRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain, undefined, options);
    }

    public static getInstance(say: MessengerFunction): UserPreferenceRepo {
        return super.getInstance(say) as UserPreferenceRepo;
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
                fieldToSet: "data.user",
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
        const user = await userRepo.getSimplifiedMany(say);
        return { user };
    }
}

export { UserPreferenceRepo as UserPreferencesRepo };
