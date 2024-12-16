import { MessengerFunction } from "../../Messenger";
import { Model, ModelCore } from "../../core/Model";
import IdCreator from "../IdCreator";
import ExObject from "../../shared/Object";
import Metadata from "../../core/types/Metadata";
import OwnershipInfo from "../types/OwnershipInfo";
import { UnitTypeRepo } from "../repos/UnitTypeRepo";

type UnitTypeData = {
	name: string;
	order: number;
};

type UnitTypeFormDetails = {};

class UnitType extends Model<UnitTypeData> {

	static ROLE = "unitType";

	static emptyData(): UnitTypeData {
		return {
			name: "",
			order: 1
		};
	}

	public static create(say: MessengerFunction, data: UnitTypeData, ownership: OwnershipInfo, meta?: Metadata): UnitType {
		if (ExObject.isDictEmpty(data)) data = UnitType.emptyData();
		const repository = IdCreator.createRepoId(UnitTypeRepo.REPO_NAME, ownership.domain);

		const now = Date.now();
		const creator = say(this, "ask", "ownUserId");
		if (!meta) meta = { timeCreated: now, timeUpdated: now, creator };

		const core: ModelCore<UnitTypeData> = { _id: "", repository, role: UnitType.ROLE, data, meta };
		return new UnitType(core);
	}

}

export { UnitType };
export type { UnitTypeData, UnitTypeFormDetails };