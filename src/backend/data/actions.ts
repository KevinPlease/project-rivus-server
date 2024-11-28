import { ObjectId } from "mongodb";
import { ExString } from "../../shared/String";

const getDefaultData = (domain: string) => {
	domain = ExString.uncapitalize(domain);
	return [
		{
			"_id": new ObjectId("66bfacc443c23b7cb68f295c"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Get Customer",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636331"
				},
				"timeUpdated": {
					"$numberLong": "1723837636331"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66bfacc443c23b7cb68f295d"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Get Form Details",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636331"
				},
				"timeUpdated": {
					"$numberLong": "1723837636331"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66bfacc443c23b7cb68f295e"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Edit Customer",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636331"
				},
				"timeUpdated": {
					"$numberLong": "1723837636331"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66bfacc443c23b7cb68f295f"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Get Customers",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636331"
				},
				"timeUpdated": {
					"$numberLong": "1723837636331"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66bfacc443c23b7cb68f2960"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Add Customer",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636331"
				},
				"timeUpdated": {
					"$numberLong": "1723837636331"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66bfacc443c23b7cb68f2961"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Public Action",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636331"
				},
				"timeUpdated": {
					"$numberLong": "1723837636331"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66bfacc443c23b7cb68f2962"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Remove Customer",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636331"
				},
				"timeUpdated": {
					"$numberLong": "1723837636331"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66bfacc443c23b7cb68f2963"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Add Customer Documents",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636331"
				},
				"timeUpdated": {
					"$numberLong": "1723837636331"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66bfacc443c23b7cb68f2964"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Remove Order",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636331"
				},
				"timeUpdated": {
					"$numberLong": "1723837636331"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66bfacc443c23b7cb68f2965"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Get Order",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636331"
				},
				"timeUpdated": {
					"$numberLong": "1723837636331"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66bfacc443c23b7cb68f2966"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Get Orders",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636331"
				},
				"timeUpdated": {
					"$numberLong": "1723837636331"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66bfacc443c23b7cb68f2967"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Add Order",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636331"
				},
				"timeUpdated": {
					"$numberLong": "1723837636331"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66bfacc443c23b7cb68f2968"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Add Order Images",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636331"
				},
				"timeUpdated": {
					"$numberLong": "1723837636331"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66bfacc443c23b7cb68f2969"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Edit Order",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636331"
				},
				"timeUpdated": {
					"$numberLong": "1723837636331"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66bfacc443c23b7cb68f296a"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Remove Property",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636331"
				},
				"timeUpdated": {
					"$numberLong": "1723837636331"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66bfacc443c23b7cb68f296b"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Get Property",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636332"
				},
				"timeUpdated": {
					"$numberLong": "1723837636332"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66bfacc443c23b7cb68f296c"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Get Properties",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636332"
				},
				"timeUpdated": {
					"$numberLong": "1723837636332"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66bfacc443c23b7cb68f296d"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Add Property",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636332"
				},
				"timeUpdated": {
					"$numberLong": "1723837636332"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66bfacc443c23b7cb68f296e"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Add Property Images",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636332"
				},
				"timeUpdated": {
					"$numberLong": "1723837636332"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66bfacc443c23b7cb68f296f"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Edit Property",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636332"
				},
				"timeUpdated": {
					"$numberLong": "1723837636332"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66bfacc443c23b7cb68f2970"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Remove Unit",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636332"
				},
				"timeUpdated": {
					"$numberLong": "1723837636332"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66bfacc443c23b7cb68f2971"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Get Unit",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636332"
				},
				"timeUpdated": {
					"$numberLong": "1723837636332"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66bfacc443c23b7cb68f2972"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Get Units",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636332"
				},
				"timeUpdated": {
					"$numberLong": "1723837636332"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66bfacc443c23b7cb68f2973"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Add Unit",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636332"
				},
				"timeUpdated": {
					"$numberLong": "1723837636332"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66bfacc443c23b7cb68f2974"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Add Unit Images",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636332"
				},
				"timeUpdated": {
					"$numberLong": "1723837636332"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66bfacc443c23b7cb68f2975"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Edit Unit",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636332"
				},
				"timeUpdated": {
					"$numberLong": "1723837636332"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66bfacc443c23b7cb68f2976"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Remove User",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636332"
				},
				"timeUpdated": {
					"$numberLong": "1723837636332"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66bfacc443c23b7cb68f2977"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Get User",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636332"
				},
				"timeUpdated": {
					"$numberLong": "1723837636332"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66bfacc443c23b7cb68f2978"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Get Users",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636332"
				},
				"timeUpdated": {
					"$numberLong": "1723837636332"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66bfacc443c23b7cb68f2979"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Add User",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636332"
				},
				"timeUpdated": {
					"$numberLong": "1723837636332"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66bfacc443c23b7cb68f297a"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Add User Images",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636332"
				},
				"timeUpdated": {
					"$numberLong": "1723837636332"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66bfacc443c23b7cb68f297b"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Edit User",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636332"
				},
				"timeUpdated": {
					"$numberLong": "1723837636332"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66eb42249e4d0820e2f7603c"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Add Unit Documents",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636332"
				},
				"timeUpdated": {
					"$numberLong": "1723837636332"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66eb42cb9e4d0820e2f7603e"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Add Property Documents",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636332"
				},
				"timeUpdated": {
					"$numberLong": "1723837636332"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66eb43bf9e4d0820e2f7603f"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Get Customer Document",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636331"
				},
				"timeUpdated": {
					"$numberLong": "1723837636331"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66eb43fb9e4d0820e2f76042"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Get Property Document",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636331"
				},
				"timeUpdated": {
					"$numberLong": "1723837636331"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66eb44229e4d0820e2f76043"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Get Unit Document",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636331"
				},
				"timeUpdated": {
					"$numberLong": "1723837636331"
				},
				"creator": "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			"_id": new ObjectId("66f71e4008f07f5100cc2424"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Get Order Pdf",
				"description": ""
			},
			"meta": {
				"timeCreated": {
					"$numberLong": "1723837636331"
				},
				"timeUpdated": {
					"$numberLong": "1723837636331"
				},
				"creator": ""
			}
		},
		{
			"_id": new ObjectId("6719777686bb1afe1bb039c7"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Remove Role",
				"description": ""
			},
			"meta": {
				"timeCreated": 1715626111,
				"timeUpdated": 1715626111,
				"creator": ""
			}
		},
		{
			"_id": new ObjectId("6719777686bb1afe1bb039c8"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Get Role",
				"description": ""
			},
			"meta": {
				"timeCreated": 1715626111,
				"timeUpdated": 1715626111,
				"creator": ""
			}
		},
		{
			"_id": new ObjectId("6719777686bb1afe1bb039c9"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Get Roles",
				"description": ""
			},
			"meta": {
				"timeCreated": 1715626111,
				"timeUpdated": 1715626111,
				"creator": ""
			}
		},
		{
			"_id": new ObjectId("6719777686bb1afe1bb039ca"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Add Role",
				"description": ""
			},
			"meta": {
				"timeCreated": 1715626111,
				"timeUpdated": 1715626111,
				"creator": ""
			}
		},
		{
			"_id": new ObjectId("6719777686bb1afe1bb039cb"),
			"repository": `actions@${domain}_sys`,
			"role": "action",
			"data": {
				"name": "Edit Role",
				"description": ""
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
