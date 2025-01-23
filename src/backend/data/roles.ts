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
					"64b877be20a24bc2e25db596",
					"64b877be20a24bc2e25db597",
					"64b877be20a24bc2e25db598",
					"64b877be20a24bc2e25db599",
					"64b877be20a24bc2e25db59a",
					"64b877be20a24bc2e25db59b",
					"64b877be20a24bc2e25db59c",
					"64b877be20a24bc2e25db59d",
					"64de9f0053f071842e689392",
					"64deacdbf401114920c1dc6a"
				]
				,
				"accessInfo": {
					"global": {
						"user": {
							"read": AccessType.OVERSEER,
							"write": AccessType.OVERSEER
						},
						"role": {
							"read": AccessType.OVERSEER,
							"write": AccessType.OVERSEER
						},
						"notification": {
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
						"notification": {
							"type": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"content": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"isRead": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"priority": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							},
							"action": {
								"read": AccessType.OVERSEER,
								"write": AccessType.OVERSEER
							}
						},
						"customer": {
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
							"city": {
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
							"referralSource": {
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
