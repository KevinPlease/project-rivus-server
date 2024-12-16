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
		"*": {
			"actionName": "Get Units"
		},
		"form": {
			"actionName": "Get Form Details"
		},
		"image/:id?": {
			"actionName": "Public Action",
			"needsAuth": false
		},
		"document/:id?": {
			"actionName": "Get Unit Document"
		}
	},

	post: {
		"": {
			"actionName": "Add Unit"
		},
		"images": {
			"actionName": "Add Unit Images"
		},
		"documents": {
			"actionName": "Add Unit Documents"
		}
	},

	put: {
		"": {
			"actionName": "Edit Unit"
		}
	}
};

export default ROUTES; 
