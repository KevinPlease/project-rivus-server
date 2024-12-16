import { ObjectId } from "mongodb";
import { ExString } from "../../shared/String";
import { AccessType } from "../types/Access";

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
							"read": AccessType.OVERSEER,
							"write": AccessType.OVERSEER
						},
						"customer": {
							"read": AccessType.OVERSEER,
							"write": AccessType.OVERSEER
						},
						"order": {
							"read": AccessType.OVERSEER,
							"write": AccessType.OVERSEER
						},
						"property": {
							"read": AccessType.OVERSEER,
							"write": AccessType.OVERSEER
						},
						"unit": {
							"read": AccessType.OVERSEER,
							"write": AccessType.OVERSEER
						},
						"role": {
							"read": AccessType.OVERSEER,
							"write": AccessType.OVERSEER
						}
					},
					"fieldAccess": {
						"user": {
							"isDraft": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"name": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"role": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"images": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"email": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"username": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"password": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"phone": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"token": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"roles": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							}
						},
						"role": {
							"isDraft": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"name": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							}
						},
						"fieldAccess": {
							"user": {
								"name": {
									"read": AccessType.SELFISH,
									"write": AccessType.SELFISH
								},
								"role": {
									"read": AccessType.SELFISH,
									"write": AccessType.SELFISH
								},
								"images": {
									"read": AccessType.SELFISH,
									"write": AccessType.SELFISH
								},
								"email": {
									"read": AccessType.SELFISH,
									"write": AccessType.SELFISH
								},
								"username": {
									"read": AccessType.SELFISH,
									"write": AccessType.SELFISH
								},
								"password": {
									"read": AccessType.SELFISH,
									"write": AccessType.SELFISH
								},
								"phone": {
									"read": AccessType.SELFISH,
									"write": AccessType.SELFISH
								},
								"token": {
									"read": AccessType.SELFISH,
									"write": AccessType.SELFISH
								},
								"roles": {
									"read": AccessType.SELFISH,
									"write": AccessType.SELFISH
								}
							},
							"role": {
								"name": {
									"read": AccessType.OVERSEER,
									"write": AccessType.OVERSEER
								},
								"description": {
									"read": AccessType.OVERSEER,
									"write": AccessType.OVERSEER
								},
								"actions": {
									"read": AccessType.OVERSEER,
									"write": AccessType.OVERSEER
								},
								"accessInfo": {
									"read": AccessType.OVERSEER,
									"write": AccessType.OVERSEER
								}
							},
							"actions": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"accessInfo": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							}
						},
						"customer": {
							"isDraft": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"name": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"title": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"mobile": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"email": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"birthdate": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"address": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"personalId": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"assignee": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"idImage": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"description": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"documents": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							}
						},
						"property": {
							"isDraft": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"propertyType": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"constructionStage": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"country": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"city": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"zone": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"builder": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"assignee": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"title": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"address": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"description": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"startOfConstruction": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"endOfConstruction": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"landArea": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"images": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"documents": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"imageThumbnail": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							}
						},
						"unit": {
							"isDraft": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"unitType": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"availability": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"country": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"city": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"zone": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"offeringType": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"price": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"currency": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"property": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"assignee": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"unitExtra": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"title": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"address": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"description": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"livingRoomCount": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"kitchenCount": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"bedroomCount": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"bathroomCount": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"floorCount": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"grossArea": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"interiorArea": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"landArea": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"images": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"documents": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"imageThumbnail": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							}
						},
						"order": {
							"isDraft": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"currency": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"customer": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"units": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"paymentMethod": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"orderStatus": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"totalAmount": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"assignee": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
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
