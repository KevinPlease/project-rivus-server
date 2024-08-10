import { MessengerFunction } from "../../Messenger";
import { Model, ModelCore } from "../../core/Model";
import IdCreator from "../IdCreator";
import ExObject from "../../shared/Object";
import Metadata from "../../core/types/Metadata";
import OwnershipInfo from "../types/OwnershipInfo";
import { DocumentDetails } from "../types/DocumentDetails";
import { PropertyRepo } from "../repos/PropertyRepo";
import { ImageDetails } from "../types/ImageDetails";

type PropertyData = {
	isDraft?: boolean;
	propertyType: string;
    constructionStage: string;
    country: string;
    city: string;
    zone: string;
    builder: string;
    assignee: string;
    title: string;
    address: string;
    description: string;
    startOfConstruction: number;
    endOfConstruction: number;
    landArea: number;
    images: ImageDetails[];
    documents: DocumentDetails[];
    imageThumbnail: string;
};

type PropertyFormDetails = {
	propertyType: any[];
	constructionStage: any[];
	country: any[];
	city: any[];
	builder: any[];
	assignee: any[];
};

class Property extends Model<PropertyData> {

	static ROLE = "property";

	static emptyData(): PropertyData {
		return {
			isDraft: true,
			propertyType: "",
			constructionStage: "",
			country: "",
			city: "",
			zone: "",
			builder: "",
			assignee: "",
			title: "",
			address: "",
			description: "",
			startOfConstruction: 1,
			endOfConstruction: 2,
			landArea: 1,
			images: [],
			documents: [],
			imageThumbnail: ""
		};
	}

	public static create(say: MessengerFunction, data: PropertyData, ownership: OwnershipInfo, meta?: Metadata): Property {
		if (ExObject.isDictEmpty(data)) data = Property.emptyData();
		const repository = IdCreator.createBranchedRepoId(PropertyRepo.REPO_NAME, ownership.branch || "", ownership.domain);

		const now = Date.now();
		const creator = say(this, "ask", "ownUserId");
		if (!meta) meta = { timeCreated: now, timeUpdated: now, creator };

		const core: ModelCore<PropertyData> = { _id: "", repository, role: Property.ROLE, data, meta };
		return new Property(core);
	}

}

export { Property };
export type { PropertyData, PropertyFormDetails };