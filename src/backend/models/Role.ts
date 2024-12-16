import { Model } from "../../core/Model";
import Metadata from "../../core/types/Metadata";
import ExObject from "../../shared/Object";
import { MessengerFunction } from "../../Messenger";
import { Access, AccessType } from "../types/Access";
import OwnershipInfo from "../types/OwnershipInfo";
import { User } from "./User";
import { Customer } from "./Customer";
import { Order } from "./Order";
import { Property } from "./Property";
import { Unit } from "./Unit";

type RoleData = {
	actions: string[];
	description: string;
	name: string;
	accessInfo: Access;
};

class Role extends Model<RoleData> {

	public static ROLE = "role";
	public static PUBLIC = "guest";

	static emptyData(): RoleData {
		return {
			name: "",
			description: "",
			accessInfo: Role.defaultAccessInfo(),
			actions: Role.defaultActions()
		};
	}

	public static create(say: MessengerFunction, data: RoleData, ownership: OwnershipInfo, meta?: Metadata): Role {
		if (ExObject.isDictEmpty(data)) data = Role.emptyData();

		if (!ownership.branch) throw "Role: Missing branch from ownership info!";

		// NOTE: cyclic dependency if importing UserRepo, therefore we use direct dependency injection
		const repo = say(this, "ask", "repo", "roles");
		return Role._create(say, data, repo.repoName, Role.ROLE, ownership, meta);
	}

	public static defaultAccessInfo(): Access {
		return {
			global: {
				[User.ROLE]: {
					read: AccessType.SELFISH,
					write: AccessType.SELFISH
				},
				[Role.ROLE]: {
					read: AccessType.SELFISH,
					write: AccessType.SELFISH
				},
				[Customer.ROLE]: {
					read: AccessType.SELFISH,
					write: AccessType.SELFISH
				},
				[Property.ROLE]: {
					read: AccessType.SELFISH,
					write: AccessType.SELFISH
				},
				[Unit.ROLE]: {
					read: AccessType.SELFISH,
					write: AccessType.SELFISH
				},
				[Order.ROLE]: {
					read: AccessType.SELFISH,
					write: AccessType.SELFISH
				}
			},
			fieldAccess: {
				[User.ROLE]: {
					"name": {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					"role": {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					"roles": {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					"images": {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					"email": {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					"username": {
						read: AccessType.MISS,
						write: AccessType.MISS
					},
					"password": {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					"phone": {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					"token": {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					}
				},
				[Role.ROLE]: {
					"name": {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					"description": {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					"actions": {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					"accessInfo": {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					}
				},
				[Customer.ROLE]: {
					isDraft: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					name: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					title: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					mobile: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					email: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					birthdate: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					address: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					personalId: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					assignee: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					idImage: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					description: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					documents: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					}
				},
				[Property.ROLE]: {
					isDraft: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					propertyType: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					constructionStage: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					country: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					city: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					zone: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					builder: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					assignee: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					title: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					address: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					description: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					startOfConstruction: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					endOfConstruction: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					landArea: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					images: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					documents: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					imageThumbnail: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					}
				},
				[Unit.ROLE]: {
					isDraft: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					unitType: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					availability: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					country: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					city: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					zone: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					offeringType: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					price: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					currency: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					property: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					assignee: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					unitExtra: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					title: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					address: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					description: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					livingRoomCount: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					kitchenCount: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					bedroomCount: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					bathroomCount: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					floorCount: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					grossArea: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					interiorArea: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					landArea: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					images: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					documents: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					imageThumbnail: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					}
				},
				[Order.ROLE]: {
					isDraft: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					currency: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					customer: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					units: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					paymentMethod: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					totalAmount: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					assignee: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					},
					orderStatus: {
						read: AccessType.SELFISH,
						write: AccessType.SELFISH
					}
				}
			}
		};
	}

	public static defaultActions(): string[] {
		return ["66bfacc443c23b7cb68f295c", "66bfacc443c23b7cb68f295d", "66bfacc443c23b7cb68f295e", "66bfacc443c23b7cb68f295f",
			"66bfacc443c23b7cb68f2960", "66bfacc443c23b7cb68f2961", "66bfacc443c23b7cb68f2963",
			"66bfacc443c23b7cb68f2965", "66bfacc443c23b7cb68f2966", "66bfacc443c23b7cb68f2967",
			"66bfacc443c23b7cb68f2968", "66bfacc443c23b7cb68f2969", "66bfacc443c23b7cb68f296b",
			"66bfacc443c23b7cb68f296c", "66bfacc443c23b7cb68f296d", "66bfacc443c23b7cb68f296e", "66bfacc443c23b7cb68f296f",
			"66bfacc443c23b7cb68f2971", "66bfacc443c23b7cb68f2972", "66bfacc443c23b7cb68f2973",
			"66bfacc443c23b7cb68f2974", "66bfacc443c23b7cb68f2975", "66bfacc443c23b7cb68f2977",
			"66bfacc443c23b7cb68f2978", "66bfacc443c23b7cb68f2979", "66bfacc443c23b7cb68f297a", "66bfacc443c23b7cb68f297b",
			"66eb42249e4d0820e2f7603c", "66eb42cb9e4d0820e2f7603e", "66eb43bf9e4d0820e2f7603f", "66eb43fb9e4d0820e2f76042",
			"66eb44229e4d0820e2f76043", "66f71e4008f07f5100cc2424", "6719777686bb1afe1bb039c8",
			"6719777686bb1afe1bb039c9", "6719777686bb1afe1bb039ca", "6719777686bb1afe1bb039cb"];
	}

	public static defaultData(): RoleData {
		return {
			accessInfo: Role.defaultAccessInfo(),
			actions: Role.defaultActions(),
			description: "Default Role",
			name: "Default Role"
		};
	}

}

export { Role };
export type { RoleData };
