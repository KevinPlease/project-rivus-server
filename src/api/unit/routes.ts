import { RawRoutesInfo } from "../../network/types/RoutesInfo";

const ROUTES: RawRoutesInfo = {
	delete: {
		"": {
			"actionName": "Remove Unit"
		}
	},

	get: {
		"": {
			"actionName": "Get Unit"
		},
		"draft": {
			"actionName": "Get Unit"
		},
		"list": {
			"actionName": "Get Units"
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
			"actionName": "Add Unit"
		},
		"images": {
			"actionName": "Add Unit Images"
		}
	},

	put: {
		"": {
			"actionName": "Edit Unit"
		}
	}
};

export default ROUTES; 
