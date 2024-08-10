import { MessengerFunction } from "../../Messenger";
import { Model, ModelCore } from "../../core/Model";
import IdCreator from "../IdCreator";
import ExObject from "../../shared/Object";
import Metadata from "../../core/types/Metadata";
import OwnershipInfo from "../types/OwnershipInfo";
import { CountryRepo } from "../repos/CountryRepo";

type CountryData = {
	isDraft?: boolean;
	name: string;
};

type CountryFormDetails = {};

class Country extends Model<CountryData> {

	static ROLE = "country";

	static emptyData(): CountryData {
		return {
			isDraft: true,
			name: ""
		};
	}

	public static create(say: MessengerFunction, data: CountryData, ownership: OwnershipInfo, meta?: Metadata): Country {
		if (ExObject.isDictEmpty(data)) data = Country.emptyData();
		const repository = IdCreator.createRepoId(CountryRepo.REPO_NAME, ownership.domain);

		const now = Date.now();
		const creator = say(this, "ask", "ownUserId");
		if (!meta) meta = { timeCreated: now, timeUpdated: now, creator };

		const core: ModelCore<CountryData> = { _id: "", repository, role: Country.ROLE, data, meta };
		return new Country(core);
	}

}

export { Country };
export type { CountryData, CountryFormDetails };