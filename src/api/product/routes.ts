import { RawRoutesInfo } from "../../network/types/RoutesInfo";

const ROUTES: RawRoutesInfo = {
	delete: {
		"": {
			"actionName": "Remove Product"
		}
	},

	get: {
		"": {
			"actionName": "Get Product"
		},
		"*": {
			"actionName": "Get Products"
		},
		"form": {
			"actionName": "Get Form Details"
		},
		"image/:id?": {
			"actionName": "Get Product Image"
		}
	},

	post: {
		"": {
			"actionName": "Add Product"
		},
		"images": {
			"actionName": "Add Product Images"
		}
	},

	put: {
		"": {
			"actionName": "Edit Product"
		}
	}
};

export default ROUTES; 
