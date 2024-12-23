import { MessengerFunction } from "../../Messenger";
import { Model, ModelCore } from "../../core/Model";
import IdCreator from "../IdCreator";
import ExObject from "../../shared/Object";
import Metadata from "../../core/types/Metadata";
import OwnershipInfo from "../types/OwnershipInfo";
import { UnitData } from "./Unit";

type OrderData = {
	currency: string;
	orderStatus: string;
	date: number;
    customer: string;
    units: ModelCore<UnitData>[];
    paymentMethod: string;
    totalAmount: number;
    assignee: string;
};

type OrderFormDetails = {
	customer: any[];
	paymentMethod: any[];
	assignee: any[];
};

class Order extends Model<OrderData> {

	static ROLE = "order";

	static emptyData(): OrderData {
		return {
			currency: "",
			orderStatus: "",
			customer: "",
			date: Date.now(),
			units: [],
			paymentMethod: "",
			totalAmount: 1,
			assignee: ""
		};
	}

	public static create(say: MessengerFunction, data: OrderData, ownership: OwnershipInfo, meta?: Metadata): Order {
		if (ExObject.isDictEmpty(data)) data = Order.emptyData();
		const repository = IdCreator.createBranchedRepoId("orders", ownership.branch || "", ownership.domain);

		const now = Date.now();
		const creator = say(this, "ask", "ownUserId");
		if (!meta) meta = { timeCreated: now, timeUpdated: now, creator };

		const core: ModelCore<OrderData> = { _id: "", repository, role: Order.ROLE, data, meta };
		return new Order(core);
	}

}

export { Order };
export type { OrderData, OrderFormDetails };