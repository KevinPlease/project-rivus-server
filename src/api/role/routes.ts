import { RawRoutesInfo } from "../../network/types/RoutesInfo";

const ROUTES: RawRoutesInfo = {
	delete: {
		"": {
			"actionName": "Remove Role"
		}
	},

	get: {
		"": {
			"actionName": "Get Role"
		},
		"*": {
			"actionName": "Get Roles"
		},
		"form": {
			"actionName": "Get Form Details"
		}
	},

	post: {
		"": {
			"actionName": "Add Role"
		}
	},

	put: {
		"": {
			"actionName": "Edit Role"
		}
	}
};

export default ROUTES; 
