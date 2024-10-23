import { ObjectId } from "mongodb";
import { ExString } from "../../shared/String";

const getDefaultData = (domain: string) => {
	domain = ExString.uncapitalize(domain);
	return [
		{
			"_id": new ObjectId("64b877be20a24bc2e25db5b8"),
			"repository": `roles@${domain}`,
			"role": "role",
			"data": {
				"name": "General Manager",
				"description": "All Access",
				"actions": [
				  "66bfacc443c23b7cb68f295c",
				  "66bfacc443c23b7cb68f295d",
				  "66bfacc443c23b7cb68f295e",
				  "66bfacc443c23b7cb68f295f",
				  "66bfacc443c23b7cb68f2960",
				  "66bfacc443c23b7cb68f2961",
				  "66bfacc443c23b7cb68f2962",
				  "66bfacc443c23b7cb68f2963",
				  "66bfacc443c23b7cb68f2964",
				  "66bfacc443c23b7cb68f2965",
				  "66bfacc443c23b7cb68f2966",
				  "66bfacc443c23b7cb68f2967",
				  "66bfacc443c23b7cb68f2968",
				  "66bfacc443c23b7cb68f2969",
				  "66bfacc443c23b7cb68f296a",
				  "66bfacc443c23b7cb68f296b",
				  "66bfacc443c23b7cb68f296c",
				  "66bfacc443c23b7cb68f296d",
				  "66bfacc443c23b7cb68f296e",
				  "66bfacc443c23b7cb68f296f",
				  "66bfacc443c23b7cb68f2970",
				  "66bfacc443c23b7cb68f2971",
				  "66bfacc443c23b7cb68f2972",
				  "66bfacc443c23b7cb68f2973",
				  "66bfacc443c23b7cb68f2974",
				  "66bfacc443c23b7cb68f2975",
				  "66bfacc443c23b7cb68f2976",
				  "66bfacc443c23b7cb68f2977",
				  "66bfacc443c23b7cb68f2978",
				  "66bfacc443c23b7cb68f2979",
				  "66bfacc443c23b7cb68f297a",
				  "66bfacc443c23b7cb68f297b",
				  "66eb42249e4d0820e2f7603c",
				  "66eb42cb9e4d0820e2f7603e",
				  "66eb43bf9e4d0820e2f7603f",
				  "66eb43fb9e4d0820e2f76042",
				  "66eb44229e4d0820e2f76043",
				  "66f71e4008f07f5100cc2424"
				],
				"accessInfo": {
				  "global": {
					"user": {
					  "read": 240,
					  "write": 240
					},
					"customer": {
					  "read": 240,
					  "write": 240
					},
					"order": {
					  "read": 240,
					  "write": 240
					},
					"property": {
					  "read": 240,
					  "write": 240
					},
					"unit": {
					  "read": 240,
					  "write": 240
					}
				  },
				  "fieldAccess": {
					"user": {
					  "isDraft": {
						"read": 4,
						"write": 4
					  },
					  "name": {
						"read": 4,
						"write": 4
					  },
					  "role": {
						"read": 4,
						"write": 4
					  },
					  "details.images": {
						"read": 4,
						"write": 4
					  },
					  "details.email": {
						"read": 4,
						"write": 4
					  },
					  "details.username": {
						"read": 4,
						"write": 4
					  },
					  "details.password": {
						"read": 4,
						"write": 4
					  },
					  "details.phone": {
						"read": 4,
						"write": 4
					  },
					  "details.token": {
						"read": 4,
						"write": 4
					  },
					  "roles": {
						"read": 4,
						"write": 4
					  }
					},
					"customer": {
					  "isDraft": {
						"read": 240,
						"write": 240
					  },
					  "name": {
						"read": 240,
						"write": 240
					  },
					  "title": {
						"read": 240,
						"write": 240
					  },
					  "mobile": {
						"read": 240,
						"write": 240
					  },
					  "email": {
						"read": 240,
						"write": 240
					  },
					  "birthdate": {
						"read": 240,
						"write": 240
					  },
					  "address": {
						"read": 240,
						"write": 240
					  },
					  "personalId": {
						"read": 240,
						"write": 240
					  },
					  "assignee": {
						"read": 240,
						"write": 240
					  },
					  "idImage": {
						"read": 240,
						"write": 240
					  },
					  "description": {
						"read": 240,
						"write": 240
					  },
					  "documents": {
						"read": 240,
						"write": 240
					  }
					},
					"property": {
					  "isDraft": {
						"read": 240,
						"write": 240
					  },
					  "propertyType": {
						"read": 240,
						"write": 240
					  },
					  "constructionStage": {
						"read": 240,
						"write": 240
					  },
					  "country": {
						"read": 240,
						"write": 240
					  },
					  "city": {
						"read": 240,
						"write": 240
					  },
					  "zone": {
						"read": 240,
						"write": 240
					  },
					  "builder": {
						"read": 240,
						"write": 240
					  },
					  "assignee": {
						"read": 240,
						"write": 240
					  },
					  "title": {
						"read": 240,
						"write": 240
					  },
					  "address": {
						"read": 240,
						"write": 240
					  },
					  "description": {
						"read": 240,
						"write": 240
					  },
					  "startOfConstruction": {
						"read": 240,
						"write": 240
					  },
					  "endOfConstruction": {
						"read": 240,
						"write": 240
					  },
					  "landArea": {
						"read": 240,
						"write": 240
					  },
					  "images": {
						"read": 240,
						"write": 240
					  },
					  "documents": {
						"read": 240,
						"write": 240
					  },
					  "imageThumbnail": {
						"read": 240,
						"write": 240
					  }
					},
					"unit": {
					  "isDraft": {
						"read": 240,
						"write": 240
					  },
					  "unitType": {
						"read": 240,
						"write": 240
					  },
					  "availability": {
						"read": 240,
						"write": 240
					  },
					  "country": {
						"read": 240,
						"write": 240
					  },
					  "city": {
						"read": 240,
						"write": 240
					  },
					  "zone": {
						"read": 240,
						"write": 240
					  },
					  "offeringType": {
						"read": 240,
						"write": 240
					  },
					  "price": {
						"read": 240,
						"write": 240
					  },
					  "currency": {
						"read": 240,
						"write": 240
					  },
					  "property": {
						"read": 240,
						"write": 240
					  },
					  "assignee": {
						"read": 240,
						"write": 240
					  },
					  "unitExtra": {
						"read": 240,
						"write": 240
					  },
					  "title": {
						"read": 240,
						"write": 240
					  },
					  "address": {
						"read": 240,
						"write": 240
					  },
					  "description": {
						"read": 240,
						"write": 240
					  },
					  "livingRoomCount": {
						"read": 240,
						"write": 240
					  },
					  "kitchenCount": {
						"read": 240,
						"write": 240
					  },
					  "bedroomCount": {
						"read": 240,
						"write": 240
					  },
					  "bathroomCount": {
						"read": 240,
						"write": 240
					  },
					  "floorCount": {
						"read": 240,
						"write": 240
					  },
					  "grossArea": {
						"read": 240,
						"write": 240
					  },
					  "interiorArea": {
						"read": 240,
						"write": 240
					  },
					  "landArea": {
						"read": 240,
						"write": 240
					  },
					  "images": {
						"read": 240,
						"write": 240
					  },
					  "documents": {
						"read": 240,
						"write": 240
					  },
					  "imageThumbnail": {
						"read": 240,
						"write": 240
					  }
					},
					"order": {
					  "isDraft": {
						"read": 240,
						"write": 240
					  },
					  "currency": {
						"read": 240,
						"write": 240
					  },
					  "customer": {
						"read": 240,
						"write": 240
					  },
					  "units": {
						"read": 240,
						"write": 240
					  },
					  "paymentMethod": {
						"read": 240,
						"write": 240
					  },
					  "orderStatus": {
						"read": 240,
						"write": 240
					  },
					  "totalAmount": {
						"read": 240,
						"write": 240
					  },
					  "assignee": {
						"read": 240,
						"write": 240
					  }
					}
				  }
				}
			  },
			"meta": {
				"timeCreated": 1715626111,
				"timeUpdated": 1715626111,
				"creator": ""
			}
		}
	]
}

export { getDefaultData };
