import { MessengerFunction } from "../../Messenger";
import { Model, ModelCore } from "../../core/Model";
import IdCreator from "../IdCreator";
import ExObject from "../../shared/Object";
import Metadata from "../../core/types/Metadata";
import OwnershipInfo from "../types/OwnershipInfo";
import { BuilderRepo } from "../repos/BuilderRepo";

type BuilderData = {
	name: string;
};

type BuilderFormDetails = {};

class Builder extends Model<BuilderData> {

	static ROLE = "builder";

	static emptyData(): BuilderData {
		return {
			name: ""
		};
	}

	public static create(say: MessengerFunction, data: BuilderData, ownership: OwnershipInfo, meta?: Metadata): Builder {
		if (ExObject.isDictEmpty(data)) data = Builder.emptyData();
		const repository = IdCreator.createRepoId(BuilderRepo.REPO_NAME, ownership.domain);

		const now = Date.now();
		const creator = say(this, "ask", "ownUserId");
		if (!meta) meta = { timeCreated: now, timeUpdated: now, creator };

		const core: ModelCore<BuilderData> = { _id: "", repository, role: Builder.ROLE, data, meta };
		return new Builder(core);
	}

}

export { Builder };
export type { BuilderData, BuilderFormDetails };