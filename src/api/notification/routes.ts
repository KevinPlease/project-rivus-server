import { RawRoutesInfo } from "../../network/types/RoutesInfo";

const ROUTES: RawRoutesInfo = {
    delete: {
        "": {
            "actionName": "Remove Notification"
        }
    },

    get: {
        "": {
            "actionName": "Get Notification"
        },
        "*": {
            "actionName": "Get Notifications"
        }
    },

    post: {
        "": {
            "actionName": "Add Notification"
        }
    },

    put: {
        "": {
            "actionName": "Edit Notification"
        }
    }
};

export default ROUTES;
