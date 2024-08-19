import { MessengerFunction } from "../../Messenger";
import { Model, ModelCore } from "../../core/Model";
import IdCreator from "../IdCreator";
import ExObject from "../../shared/Object";
import Metadata from "../../core/types/Metadata";
import OwnershipInfo from "../types/OwnershipInfo";
import { DocumentDetails } from "../types/DocumentDetails";
import { UnitRepo } from "../repos/UnitRepo";
import { ImageDetails } from "../types/ImageDetails";

type UnitData = {
	isDraft?: boolean;
	unitType: string;
	availability: string;
	offeringType: string;
	price: number;
	currency: string;
	property: string;
	assignee: string;
	unitExtra: any[];
	title: string;
	description: string;
	livingRoomCount: number;
	kitchenCount: number;
	bedroomCount: number;
	bathroomCount: number;
	floorCount: number;
	grossArea: number;
	interiorArea: number;
	landArea: number;
	images?: ImageDetails[];
	documents?: DocumentDetails[];
	imageThumbnail?: string;
};

type UnitFormDetails = {
	unitType: any[];
	availability: any[];
	country: any[];
	city: any[];
	builder: any[];
	assignee: any[];
	offeringType: any[];
	property: any[];
	unitExtra: any[];
};

class Unit extends Model<UnitData> {

	static ROLE = "unit";

	static emptyData(): UnitData {
		return {
			isDraft: true,
			unitType: "",
			availability: "",
			offeringType: "",
			price: 1,
			currency: "",
			property: "",
			assignee: "",
			unitExtra: [],
			title: "",
			description: "",
			livingRoomCount: 1,
			kitchenCount: 1,
			bedroomCount: 1,
			bathroomCount: 1,
			floorCount: 1,
			grossArea: 1,
			interiorArea: 1,
			landArea: 1,
			images: [],
			documents: [],
			imageThumbnail: ""
		};
	}

	public static create(say: MessengerFunction, data: UnitData, ownership: OwnershipInfo, meta?: Metadata): Unit {
		if (ExObject.isDictEmpty(data)) data = Unit.emptyData();
		const repository = IdCreator.createBranchedRepoId(UnitRepo.REPO_NAME, ownership.branch || "", ownership.domain);

		const now = Date.now();
		const creator = say(this, "ask", "ownUserId");
		if (!meta) meta = { timeCreated: now, timeUpdated: now, creator };

		const core: ModelCore<UnitData> = { _id: "", repository, role: Unit.ROLE, data, meta };
		return new Unit(core);
	}

}

export { Unit };
export type { UnitData, UnitFormDetails };