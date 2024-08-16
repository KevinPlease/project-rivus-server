import { ObjectId } from "mongodb";
import MongoCollection from "../../mongo/MongoCollection";
import { Action, ActionData } from "../models/Action";
import { BaseRepo } from "./BaseRepo";
import { MessengerFunction } from "../../Messenger";
import { getDefaultData } from "../data/actions";
import { OperationStatus } from "../../types/Operation";

class ActionRepo extends BaseRepo<ActionData> {
	public static REPO_NAME = "actions";
	public static MODEL_ROLE_NAME = Action.ROLE;

	public static create(collection: MongoCollection, domain: string) {
		return new ActionRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain);
	}

	public static getInstance(say: MessengerFunction): ActionRepo {
		return super.getInstance(say) as ActionRepo;
	}

	public async getActionIdByName(name: string): Promise<string> {
		const query = { "data.name": name };
		const projection = { projection: { _id: 1 } };
		const actionCore: { _id: ObjectId } = await this.collection.findOne(query, projection);
		return actionCore?._id.toString();
	}

	public async addDefaultData(say: MessengerFunction): Promise<OperationStatus> {
		const count = await this.collection.count({});
		if (count > 0) return "success";

		const data: ActionData[] = [
			{ name: "Get Customer", description: "" },
			{ name: "Get Form Details", description: "" },
			{ name: "Edit Customer", description: "" },
			{ name: "Get Customers", description: "" },
			{ name: "Add Customer", description: "" },
			{ name: "Public Action", description: "" },
			{ name: "Remove Customer", description: "" },
			{ name: "Add Customer Documents", description: "" },
			{ name: "Remove Order", description: "" },
			{ name: "Get Order", description: "" },
			{ name: "Get Orders", description: "" },
			{ name: "Add Order", description: "" },
			{ name: "Add Order Images", description: "" },
			{ name: "Edit Order", description: "" },
			{ name: "Remove Property", description: "" },
			{ name: "Get Property", description: "" },
			{ name: "Get Properties", description: "" },
			{ name: "Add Property", description: "" },
			{ name: "Add Property Images", description: "" },
			{ name: "Edit Property", description: "" },
			{ name: "Remove Unit", description: "" },
			{ name: "Get Unit", description: "" },
			{ name: "Get Units", description: "" },
			{ name: "Add Unit", description: "" },
			{ name: "Add Unit Images", description: "" },
			{ name: "Edit Unit", description: "" },
			{ name: "Remove User", description: "" },
			{ name: "Get User", description: "" },
			{ name: "Get Users", description: "" },
			{ name: "Add User", description: "" },
			{ name: "Add User Images", description: "" },
			{ name: "Edit User", description: "" }			  
		];
		return this.addMany(data, say);
	}

}

export { ActionRepo };
