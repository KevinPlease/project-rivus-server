import { RawRoutesInfo } from "../../network/types/RoutesInfo";

const ROUTES: RawRoutesInfo = {
    delete: {
        "": {
            "actionName": "Remove User Preference"
        }
    },

    get: {
        "": {
            "actionName": "Get User Preference"
        },
        "*": {
            "actionName": "Get User Preferences"
        }
    },

    post: {
        "": {
            "actionName": "Add User Preference"
        }
    },

    put: {
        "": {
            "actionName": "Edit User Preference"
        }
    }
};

export default ROUTES;
