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
		"*": {
			"actionName": "Get Customers"
		},
		"form": {
			"actionName": "Get Form Details"
		},
		"document/:id?": {
			"actionName": "Get Customer Document"
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
