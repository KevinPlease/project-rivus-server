import { Model, ModelCore } from "../../core/Model";
import { GenericDictionary } from "../../types/Dictionary";
import { MessengerFunction } from "../../Messenger";
import ExObject from "../../shared/Object";
import Metadata from "../../core/types/Metadata";
import OwnershipInfo from "../types/OwnershipInfo";
import IdCreator from "../IdCreator";
import { User } from "./User";

enum EPreferenceType {
    SYSTEM = 131,
    NOTIFICATIONS = 132
}

type Preference = {
  value: any;
  action: string;
  fieldType: number;  
};

type ModelPreference = GenericDictionary<Preference[]>;

type UserPreferenceData = {
    user: string;
    type: EPreferenceType;
    content: ModelPreference;
};

type UserPreferenceFormDetails = {
    user: any[]
}

class UserPreference extends Model<UserPreferenceData> {
	static ROLE = "userPreference";
	static CONTENT_FOR_TYPE = {
		[EPreferenceType.NOTIFICATIONS]: {
			[User.ROLE]: [{ fieldType: 1, action: "create", value: true }, { fieldType: 1, action: "update", value: true }]
		},
		[EPreferenceType.SYSTEM]: {}
	};

	static emptyData(): UserPreferenceData {
		return {
			user: "",
			type: EPreferenceType.SYSTEM,
			content: {}
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

	public static defaultData(user: string, type: EPreferenceType): UserPreferenceData {
		const content = UserPreference.CONTENT_FOR_TYPE[type] || {};
        
		return {
			user,
			type,
			content
		};
	}

}

export { UserPreference, EPreferenceType };
export type { UserPreferenceData, UserPreferenceFormDetails, ModelPreference, Preference };
