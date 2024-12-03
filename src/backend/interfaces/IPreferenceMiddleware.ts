import { MessengerFunction } from "../../Messenger";
import { EPreferenceType, Preference } from "../models/UserPreference";

interface IPreferenceMiddleware {

    getPreferencesForModel(modelRole: string, userId: string, type: EPreferenceType, say: MessengerFunction): Promise<Preference[]>;

}

export default IPreferenceMiddleware;
