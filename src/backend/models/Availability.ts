import { MessengerFunction } from "../../Messenger";
import { Model, ModelCore } from "../../core/Model";
import IdCreator from "../IdCreator";
import ExObject from "../../shared/Object";
import Metadata from "../../core/types/Metadata";
import OwnershipInfo from "../types/OwnershipInfo";
import { AvailabilityRepo } from "../repos/AvailabilityRepo";

type AvailabilityData = {
	isDraft?: boolean;
	name: string;
	order: number;
};

type AvailabilityFormDetails = {};

class Availability extends Model<AvailabilityData> {

	static ROLE = "availability";

	static emptyData(): AvailabilityData {
		return {
			isDraft: true,
			name: "",
			order: 1
		};
	}

	public static create(say: MessengerFunction, data: AvailabilityData, ownership: OwnershipInfo, meta?: Metadata): Availability {
		if (ExObject.isDictEmpty(data)) data = Availability.emptyData();
		const repository = IdCreator.createRepoId(AvailabilityRepo.REPO_NAME, ownership.domain);

		const now = Date.now();
		const creator = say(this, "ask", "ownUserId");
		if (!meta) meta = { timeCreated: now, timeUpdated: now, creator };

		const core: ModelCore<AvailabilityData> = { _id: "", repository, role: Availability.ROLE, data, meta };
		return new Availability(core);
	}

}

export { Availability };
export type { AvailabilityData, AvailabilityFormDetails };