import Metadata from "../../core/types/Metadata";
import { Model } from "../../core/Model";
import { MessengerFunction } from "../../Messenger";
import OwnershipInfo from "../types/OwnershipInfo";
import ExObject from "../../shared/Object";

type BrandData = {
	name: string;
	description: string;
};

class Brand extends Model<BrandData> {
	static emptyData(): BrandData {
		return {
			name: "",
			description: "",
		};
	}

	public static create(say: MessengerFunction, data: BrandData, ownership: OwnershipInfo, meta?: Metadata): Brand {
		if (ExObject.isDictEmpty(data)) data = Brand.emptyData();

		const brandRepo = say(this, "ask", "repo", "brands");
		return Brand._create(say, data, brandRepo.repoName, "brand", ownership, meta);
	}
}

export { Brand };
export type { BrandData };
