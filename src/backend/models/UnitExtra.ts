import { MessengerFunction } from "../../Messenger";
import { Model, ModelCore } from "../../core/Model";
import IdCreator from "../IdCreator";
import ExObject from "../../shared/Object";
import Metadata from "../../core/types/Metadata";
import OwnershipInfo from "../types/OwnershipInfo";
import { UnitExtraRepo } from "../repos/UnitExtraRepo";

type UnitExtraData = {
	isDraft?: boolean;
	name: string;
};

type UnitExtraFormDetails = {};

class UnitExtra extends Model<UnitExtraData> {

	static ROLE = "unitExtra";

	static emptyData(): UnitExtraData {
		return {
			isDraft: true,
			name: ""
		};
	}

	public static create(say: MessengerFunction, data: UnitExtraData, ownership: OwnershipInfo, meta?: Metadata): UnitExtra {
		if (ExObject.isDictEmpty(data)) data = UnitExtra.emptyData();
		const repository = IdCreator.createRepoId(UnitExtraRepo.REPO_NAME, ownership.domain);

		const now = Date.now();
		const creator = say(this, "ask", "ownUserId");
		if (!meta) meta = { timeCreated: now, timeUpdated: now, creator };

		const core: ModelCore<UnitExtraData> = { _id: "", repository, role: UnitExtra.ROLE, data, meta };
		return new UnitExtra(core);
	}

}

export { UnitExtra };
export type { UnitExtraData, UnitExtraFormDetails };