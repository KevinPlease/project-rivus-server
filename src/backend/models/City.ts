import { MessengerFunction } from "../../Messenger";
import { Model, ModelCore } from "../../core/Model";
import IdCreator from "../IdCreator";
import ExObject from "../../shared/Object";
import Metadata from "../../core/types/Metadata";
import OwnershipInfo from "../types/OwnershipInfo";
import { CityRepo } from "../repos/CityRepo";

type CityData = {
	name: string;
	country: string;
	order: number;
};

type CityFormDetails = {};

class City extends Model<CityData> {

	static ROLE = "city";

	static emptyData(): CityData {
		return {
			name: "",
			country: "",
			order: 1
		};
	}

	public static create(say: MessengerFunction, data: CityData, ownership: OwnershipInfo, meta?: Metadata): City {
		if (ExObject.isDictEmpty(data)) data = City.emptyData();
		const repository = IdCreator.createRepoId(CityRepo.REPO_NAME, ownership.domain);

		const now = Date.now();
		const creator = say(this, "ask", "ownUserId");
		if (!meta) meta = { timeCreated: now, timeUpdated: now, creator };

		const core: ModelCore<CityData> = { _id: "", repository, role: City.ROLE, data, meta };
		return new City(core);
	}

}

export { City };
export type { CityData, CityFormDetails };