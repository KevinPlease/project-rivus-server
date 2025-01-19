import Metadata from "../../core/types/Metadata";
import { Model } from "../../core/Model";
import { MessengerFunction } from "../../Messenger";
import OwnershipInfo from "../types/OwnershipInfo";
import ExObject from "../../shared/Object";

type CategoryData = {
	name: string;
	description: string;
};

class Category extends Model<CategoryData> {
	static emptyData(): CategoryData {
		return {
			name: "",
			description: "",
		};
	}

	public static create(say: MessengerFunction, data: CategoryData, ownership: OwnershipInfo, meta?: Metadata): Category {
		if (ExObject.isDictEmpty(data)) data = Category.emptyData();

		const categoryRepo = say(this, "ask", "repo", "categories");
		return Category._create(say, data, categoryRepo.repoName, "category", ownership, meta);
	}
}

export { Category };
export type { CategoryData };
