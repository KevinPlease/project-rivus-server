import { RawRoutesInfo } from "../../network/types/RoutesInfo";

const ROUTES: RawRoutesInfo = {
	delete: {
		"": {
			"actionName": "Remove Order"
		}
	},

	get: {
		"": {
			"actionName": "Get Order"
		},
		"draft": {
			"actionName": "Get Order"
		},
		"*": {
			"actionName": "Get Orders"
		},
		"form": {
			"actionName": "Get Form Details"
		},
		"image/:id?": {
			"actionName": "Public Action",
			"needsAuth": false
		},
		"report/:id?": {
			"actionName": "Get Order Pdf"
		}
	},

	post: {
		"": {
			"actionName": "Add Order"
		},
		"images": {
			"actionName": "Add Order Images"
		}
	},

	put: {
		"": {
			"actionName": "Edit Order"
		}
	}
};

export default ROUTES; 
