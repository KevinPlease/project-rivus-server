import Metadata from "../../core/types/Metadata";
import { Model } from "../../core/Model";
import { MessengerFunction } from "../../Messenger";
import OwnershipInfo from "../types/OwnershipInfo";
import ExObject from "../../shared/Object";

type ColorData = {
	name: string;
};

class Color extends Model<ColorData> {
	static emptyData(): ColorData {
		return {
			name: "",
		};
	}

	public static create(say: MessengerFunction, data: ColorData, ownership: OwnershipInfo, meta?: Metadata): Color {
		if (ExObject.isDictEmpty(data)) data = Color.emptyData();

		const colorRepo = say(this, "ask", "repo", "colors");
		return Color._create(say, data, colorRepo.repoName, "color", ownership, meta);
	}
}

export { Color };
export type { ColorData };
