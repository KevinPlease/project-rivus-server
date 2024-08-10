import { MessengerFunction } from "../../Messenger";
import { Model, ModelCore } from "../../core/Model";
import IdCreator from "../IdCreator";
import ExObject from "../../shared/Object";
import Metadata from "../../core/types/Metadata";
import OwnershipInfo from "../types/OwnershipInfo";
import { PropertyTypeRepo } from "../repos/PropertyTypeRepo";

type PropertyTypeData = {
	isDraft?: boolean;
	name: string;
};

type PropertyTypeFormDetails = {};

class PropertyType extends Model<PropertyTypeData> {

	static ROLE = "propertyType";

	static emptyData(): PropertyTypeData {
		return {
			isDraft: true,
			name: ""
		};
	}

	public static create(say: MessengerFunction, data: PropertyTypeData, ownership: OwnershipInfo, meta?: Metadata): PropertyType {
		if (ExObject.isDictEmpty(data)) data = PropertyType.emptyData();
		const repository = IdCreator.createRepoId(PropertyTypeRepo.REPO_NAME, ownership.domain);

		const now = Date.now();
		const creator = say(this, "ask", "ownUserId");
		if (!meta) meta = { timeCreated: now, timeUpdated: now, creator };

		const core: ModelCore<PropertyTypeData> = { _id: "", repository, role: PropertyType.ROLE, data, meta };
		return new PropertyType(core);
	}

}

export { PropertyType };
export type { PropertyTypeData, PropertyTypeFormDetails };