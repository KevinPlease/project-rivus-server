import { MessengerFunction } from "../../Messenger";
import { Model, ModelCore } from "../../core/Model";
import IdCreator from "../IdCreator";
import ExObject from "../../shared/Object";
import Metadata from "../../core/types/Metadata";
import OwnershipInfo from "../types/OwnershipInfo";
import { ConstructionStageRepo } from "../repos/ConstructionStageRepo";

type ConstructionStageData = {
	isDraft?: boolean;
	name: string;
};

type ConstructionStageFormDetails = {};

class ConstructionStage extends Model<ConstructionStageData> {

	static ROLE = "constructionStage";

	static emptyData(): ConstructionStageData {
		return {
			isDraft: true,
			name: ""
		};
	}

	public static create(say: MessengerFunction, data: ConstructionStageData, ownership: OwnershipInfo, meta?: Metadata): ConstructionStage {
		if (ExObject.isDictEmpty(data)) data = ConstructionStage.emptyData();
		const repository = IdCreator.createRepoId(ConstructionStageRepo.REPO_NAME, ownership.domain);

		const now = Date.now();
		const creator = say(this, "ask", "ownUserId");
		if (!meta) meta = { timeCreated: now, timeUpdated: now, creator };

		const core: ModelCore<ConstructionStageData> = { _id: "", repository, role: ConstructionStage.ROLE, data, meta };
		return new ConstructionStage(core);
	}

}

export { ConstructionStage };
export type { ConstructionStageData, ConstructionStageFormDetails };