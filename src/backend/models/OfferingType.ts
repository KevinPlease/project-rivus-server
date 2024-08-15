import { MessengerFunction } from "../../Messenger";
import { Model, ModelCore } from "../../core/Model";
import IdCreator from "../IdCreator";
import ExObject from "../../shared/Object";
import Metadata from "../../core/types/Metadata";
import OwnershipInfo from "../types/OwnershipInfo";
import { OfferingTypeRepo } from "../repos/OfferingTypeRepo";

type OfferingTypeData = {
	isDraft?: boolean;
	name: string;
	order: number;
};

type OfferingTypeFormDetails = {};

class OfferingType extends Model<OfferingTypeData> {

	static ROLE = "offeringType";

	static emptyData(): OfferingTypeData {
		return {
			isDraft: true,
			name: "",
			order: 1
		};
	}

	public static create(say: MessengerFunction, data: OfferingTypeData, ownership: OwnershipInfo, meta?: Metadata): OfferingType {
		if (ExObject.isDictEmpty(data)) data = OfferingType.emptyData();
		const repository = IdCreator.createRepoId(OfferingTypeRepo.REPO_NAME, ownership.domain);

		const now = Date.now();
		const creator = say(this, "ask", "ownUserId");
		if (!meta) meta = { timeCreated: now, timeUpdated: now, creator };

		const core: ModelCore<OfferingTypeData> = { _id: "", repository, role: OfferingType.ROLE, data, meta };
		return new OfferingType(core);
	}

}

export { OfferingType };
export type { OfferingTypeData, OfferingTypeFormDetails };