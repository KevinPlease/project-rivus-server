import { RawRoutesInfo } from "../../network/types/RoutesInfo";

const ROUTES: RawRoutesInfo = {
	delete: {
		"": {
			"actionName": "Remove User"
		}
	},

	get: {
		"": {
			"actionName": "Get User"
		},
		"draft": {
			"actionName": "Get User"
		},
		"list": {
			"actionName": "Get Users"
		},
		"form": {
			"actionName": "Get Form Details"
		},
		"image/:id?": {
			"actionName": "Public Action",
			"needsAuth": false
		}
	},

	post: {
		"": {
			"actionName": "Add User"
		},
		"images": {
			"actionName": "Add User Images"
		}
	},

	put: {
		"": {
			"actionName": "Edit User"
		}
	}
};

export default ROUTES; 
