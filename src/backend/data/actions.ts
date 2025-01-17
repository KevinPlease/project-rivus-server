import { ObjectId } from "mongodb";
import { ExString } from "../../shared/String";

const getDefaultData = (domain: string) => {
	domain = ExString.uncapitalize(domain);
	return [
		{
			_id: new ObjectId("66bfacc443c23b7cb68f2961"),
			repository: `actions@${domain}_sys`,
			role: "action",
			data: {
				name: "Public Action",
				description: ""
			},
			meta: {
				timeCreated: 1723837636331,
				timeUpdated: 1723837636331,
				creator: "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			_id: new ObjectId("66bfacc443c23b7cb68f2976"),
			repository: `actions@${domain}_sys`,
			role: "action",
			data: {
				name: "Remove User",
				description: ""
			},
			meta: {
				timeCreated: 1723837636332,
				timeUpdated: 1723837636332,
				creator: "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			_id: new ObjectId("66bfacc443c23b7cb68f2977"),
			repository: `actions@${domain}_sys`,
			role: "action",
			data: {
				name: "Get User",
				description: ""
			},
			meta: {
				timeCreated: 1723837636332,
				timeUpdated: 1723837636332,
				creator: "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			_id: new ObjectId("66bfacc443c23b7cb68f2978"),
			repository: `actions@${domain}_sys`,
			role: "action",
			data: {
				name: "Get Users",
				description: ""
			},
			meta: {
				timeCreated: 1723837636332,
				timeUpdated: 1723837636332,
				creator: "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			_id: new ObjectId("66bfacc443c23b7cb68f2979"),
			repository: `actions@${domain}_sys`,
			role: "action",
			data: {
				name: "Add User",
				description: ""
			},
			meta: {
				timeCreated: 1723837636332,
				timeUpdated: 1723837636332,
				creator: "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			_id: new ObjectId("66bfacc443c23b7cb68f297a"),
			repository: `actions@${domain}_sys`,
			role: "action",
			data: {
				name: "Add User Images",
				description: ""
			},
			meta: {
				timeCreated: 1723837636332,
				timeUpdated: 1723837636332,
				creator: "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			_id: new ObjectId("66bfacc443c23b7cb68f297b"),
			repository: `actions@${domain}_sys`,
			role: "action",
			data: {
				name: "Edit User",
				description: ""
			},
			meta: {
				timeCreated: 1723837636332,
				timeUpdated: 1723837636332,
				creator: "21:47:16 -- undefined:Function : undefined"
			}
		},
		{
			_id: new ObjectId("66f71e4008f07f5100cc2424"),
			repository: `actions@${domain}_sys`,
			role: "action",
			data: {
				name: "Get Order Pdf",
				description: ""
			},
			meta: {
				timeCreated: 1723837636331,
				timeUpdated: 1723837636331,
				creator: ""
			}
		},
		{
			_id: new ObjectId("6719777686bb1afe1bb039c7"),
			repository: `actions@${domain}_sys`,
			role: "action",
			data: {
				name: "Remove Role",
				description: ""
			},
			meta: {
				timeCreated: 1715626111,
				timeUpdated: 1715626111,
				creator: ""
			}
		},
		{
			_id: new ObjectId("6719777686bb1afe1bb039c8"),
			repository: `actions@${domain}_sys`,
			role: "action",
			data: {
				name: "Get Role",
				description: ""
			},
			meta: {
				timeCreated: 1715626111,
				timeUpdated: 1715626111,
				creator: ""
			}
		},
		{
			_id: new ObjectId("6719777686bb1afe1bb039c9"),
			repository: `actions@${domain}_sys`,
			role: "action",
			data: {
				name: "Get Roles",
				description: ""
			},
			meta: {
				timeCreated: 1715626111,
				timeUpdated: 1715626111,
				creator: ""
			}
		},
		{
			_id: new ObjectId("6719777686bb1afe1bb039ca"),
			repository: `actions@${domain}_sys`,
			role: "action",
			data: {
				name: "Add Role",
				description: ""
			},
			meta: {
				timeCreated: 1715626111,
				timeUpdated: 1715626111,
				creator: ""
			}
		},
		{
			_id: new ObjectId("6719777686bb1afe1bb039cb"),
			repository: `actions@${domain}_sys`,
			role: "action",
			data: {
				name: "Edit Role",
				description: ""
			},
			meta: {
				timeCreated: 1715626111,
				timeUpdated: 1715626111,
				creator: ""
			}
		}
	];
}

export { getDefaultData };
