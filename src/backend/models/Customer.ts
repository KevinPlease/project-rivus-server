import { MessengerFunction } from "../../Messenger";
import { Model, ModelCore } from "../../core/Model";
import IdCreator from "../IdCreator";
import ExObject from "../../shared/Object";
import Metadata from "../../core/types/Metadata";
import OwnershipInfo from "../types/OwnershipInfo";
import { DocumentDetails } from "../types/DocumentDetails";

type CustomerData = {
	name: string;
	mobile: string;
	email: string;
	address: string;
	source: string;
	assignee: string;
	idImage: string;
	description: string;
	documents?: DocumentDetails[];
};

type CustomerFormDetails = {
	assignee: any[]
}

class Customer extends Model<CustomerData> {

	static ROLE = "customer";

	static emptyData(): CustomerData {
		return {
			name: "",
			mobile: "",
			email: "",
			address: "",
			source: "",
			assignee: "",
			idImage: "",
			description: "",
			documents: []
		};
	}

	public static create(say: MessengerFunction, data: CustomerData, ownership: OwnershipInfo, meta?: Metadata): Customer {
		if (ExObject.isDictEmpty(data)) data = Customer.emptyData();
		const repository = IdCreator.createBranchedRepoId("customers", ownership.branch || "", ownership.domain);

		const now = Date.now();
		const creator = say(this, "ask", "ownUserId");
		if (!meta) meta = { timeCreated: now, timeUpdated: now, creator };

		const core: ModelCore<CustomerData> = { _id: "", repository, role: Customer.ROLE, data, meta };
		return new Customer(core);
	}

}

export { Customer };
export type { CustomerData, CustomerFormDetails };