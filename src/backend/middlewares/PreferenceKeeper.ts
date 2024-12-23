import { MessengerFunction } from "../../Messenger";
import IPreferenceMiddleware from "../interfaces/IPreferenceMiddleware";
import { EPreferenceType, ModelPreference, Preference } from "../models/UserPreference";
import { UserPreferenceRepo } from "../repos/UserPreferenceRepo";

class PreferenceKeeper implements IPreferenceMiddleware {

	public async getPreferencesForModel(modelRole: string, userId: string, type: EPreferenceType, say: MessengerFunction): Promise<Preference[]> {
		const userPreferenceRepo = UserPreferenceRepo.getInstance(say);
		const userPreference = await userPreferenceRepo.findByInfo(say, userId, type, modelRole);
		if (!userPreference) return [];

		return userPreference.data.content[modelRole];
	}

	public async getPreferencesForAll(userId: string, type: EPreferenceType, say: MessengerFunction): Promise<ModelPreference> {
		const userPreferenceRepo = UserPreferenceRepo.getInstance(say);
		const userPreference = await userPreferenceRepo.findByInfo(say, userId, type);
		if (!userPreference) return {};

		return userPreference.data.content;
	}
}

export default PreferenceKeeper;
