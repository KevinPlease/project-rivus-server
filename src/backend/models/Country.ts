import Metadata from "../../core/types/Metadata";
import { Model } from "../../core/Model";
import { MessengerFunction } from "../../Messenger";
import OwnershipInfo from "../types/OwnershipInfo";
import ExObject from "../../shared/Object";

type CountryData = {
	name: string;
};

class Country extends Model<CountryData> {
	static emptyData(): CountryData {
		return {
			name: "",
		};
	}

	public static create(say: MessengerFunction, data: CountryData, ownership: OwnershipInfo, meta?: Metadata): Country {
		if (ExObject.isDictEmpty(data)) data = Country.emptyData();

		const countryRepo = say(this, "ask", "repo", "countries");
		return Country._create(say, data, countryRepo.repoName, "country", ownership, meta);
	}
}

export { Country };
export type { CountryData };
