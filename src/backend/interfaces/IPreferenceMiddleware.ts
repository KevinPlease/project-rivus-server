import { MessengerFunction } from "../../Messenger";
import { EPreferenceType, ModelPreference, Preference } from "../models/UserPreference";

interface IPreferenceMiddleware {

    getPreferencesForModel(modelRole: string, userId: string, type: EPreferenceType, say: MessengerFunction): Promise<Preference[]>;

    getPreferencesForAll(userId: string, type: EPreferenceType, say: MessengerFunction): Promise<ModelPreference>;

}

export default IPreferenceMiddleware;
