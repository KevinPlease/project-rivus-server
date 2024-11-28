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
		"*": {
			"actionName": "Get Properties"
		},
		"form": {
			"actionName": "Get Form Details"
		},
		"image/:id?": {
			"actionName": "Public Action",
			"needsAuth": false
		},
		"document/:id?": {
			"actionName": "Get Property Document"
		}
	},

	post: {
		"": {
			"actionName": "Add Property"
		},
		"images": {
			"actionName": "Add Property Images"
		},
		"documents": {
			"actionName": "Add Property Documents"
		}
	},

	put: {
		"": {
			"actionName": "Edit Property"
		}
	}
};

export default ROUTES; 
