import { RawRoutesInfo } from "../../network/types/RoutesInfo";

const ROUTES: RawRoutesInfo = {
	delete: {
		"": {
			"actionName": "Remove Property"
		}
	},

	get: {
		"": {
			"actionName": "Get Property"
		},
		"draft": {
			"actionName": "Get Property"
		},
		"list": {
			"actionName": "Get Properties"
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
			"actionName": "Add Property"
		},
		"images": {
			"actionName": "Add Property Images"
		}
	},

	put: {
		"": {
			"actionName": "Edit Property"
		}
	}
};

export default ROUTES; 
