import { Model, ModelCore } from "../../core/Model";
import { Dictionary } from "../../types/Dictionary";
import { MessengerFunction } from "../../Messenger";
import ExObject from "../../shared/Object";
import Metadata from "../../core/types/Metadata";
import OwnershipInfo from "../types/OwnershipInfo";
import IdCreator from "../IdCreator";

export enum ENotificationType {
    system = 1,
    user = 2
}

type UserPreferenceData = {
    user: string;
    type: ENotificationType;
    content: Dictionary[];
};

type UserPreferenceFormDetails = {
    user: any[]
}

class UserPreference extends Model<UserPreferenceData> {
    static ROLE = "userPreference";

    static emptyData(): UserPreferenceData {
        return {
            user: "",
            type: ENotificationType.system,
            content: []
        };
    }

    public static create(say: MessengerFunction, data: UserPreferenceData, ownership: OwnershipInfo, meta?: Metadata): UserPreference {
        if (ExObject.isDictEmpty(data)) data = UserPreference.emptyData();
        const repository = IdCreator.createBranchedRepoId("userPreferences", ownership.branch || "", ownership.domain);

        const now = Date.now();
        const creator = say(this, "ask", "ownUserId");
        meta = {
            timeCreated: now,
            timeUpdated: now,
            creator,
            ...meta
        };

        const core: ModelCore<UserPreferenceData> = { _id: "", repository, role: UserPreference.ROLE, data, meta };
		return new UserPreference(core);
    }

}

export { UserPreference };
export type { UserPreferenceData, UserPreferenceFormDetails };
