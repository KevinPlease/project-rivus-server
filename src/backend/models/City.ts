import Metadata from "../../core/types/Metadata";
import { Model } from "../../core/Model";
import { MessengerFunction } from "../../Messenger";
import OwnershipInfo from "../types/OwnershipInfo";
import ExObject from "../../shared/Object";

type CityData = {
	name: string;
	country: string;
};

class City extends Model<CityData> {
	static emptyData(): CityData {
		return {
			name: "",
			country: "",
		};
	}

	public static create(say: MessengerFunction, data: CityData, ownership: OwnershipInfo, meta?: Metadata): City {
		if (ExObject.isDictEmpty(data)) data = City.emptyData();

		const cityRepo = say(this, "ask", "repo", "cities");
		return City._create(say, data, cityRepo.repoName, "city", ownership, meta);
	}
}

export { City };
export type { CityData };
