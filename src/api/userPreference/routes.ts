import { RawRoutesInfo } from "../../network/types/RoutesInfo";

const ROUTES: RawRoutesInfo = {
    delete: {
        "": {
            "actionName": "Remove User Preferences"
        }
    },

    get: {
        "": {
            "actionName": "Get User Preferences"
        },
        "*": {
            "actionName": "Get User Preferences List"
        }
    },

    post: {
        "": {
            "actionName": "Add User Preferences"
        }
    },

    put: {
        "": {
            "actionName": "Edit User Preferences"
        }
    }
};

export default ROUTES;
