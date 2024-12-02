import { MessengerFunction } from "../../Messenger";
import { EPreferenceType, ModelPreference } from "../models/UserPreference";

interface IPreferenceMiddleware {

    getPreferencesForModel(modelRole: string, userId: string, type: EPreferenceType, say: MessengerFunction): Promise<ModelPreference[]>;

}

export default IPreferenceMiddleware;
