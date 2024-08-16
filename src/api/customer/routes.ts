import { RawRoutesInfo } from "../../network/types/RoutesInfo";

const ROUTES: RawRoutesInfo = {
	delete: {
		"": {
			"actionName": "Remove Customer"
		}
	},

	get: {
		"": {
			"actionName": "Get Customer"
		},
		"draft": {
			"actionName": "Get Customer"
		},
		"*": {
			"actionName": "Get Customers"
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
			"actionName": "Add Customer"
		},
		"documents": {
			"actionName": "Add Customer Documents"
		}
	},

	put: {
		"": {
			"actionName": "Edit Customer"
		}
	}
};

export default ROUTES; 
