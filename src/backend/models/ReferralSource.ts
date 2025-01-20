import Metadata from "../../core/types/Metadata";
import { Model } from "../../core/Model";
import { MessengerFunction } from "../../Messenger";
import OwnershipInfo from "../types/OwnershipInfo";
import ExObject from "../../shared/Object";

type ReferralSourceData = {
	name: string;
	description: string;
};

class ReferralSource extends Model<ReferralSourceData> {
	static emptyData(): ReferralSourceData {
		return {
			name: "",
			description: "",
		};
	}

	public static create(say: MessengerFunction, data: ReferralSourceData, ownership: OwnershipInfo, meta?: Metadata): ReferralSource {
		if (ExObject.isDictEmpty(data)) data = ReferralSource.emptyData();

		const brandRepo = say(this, "ask", "repo", "referralSources");
		return ReferralSource._create(say, data, brandRepo.repoName, "referralSource", ownership, meta);
	}
}

export { ReferralSource };
export type { ReferralSourceData };
