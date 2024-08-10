import { MessengerFunction } from "../../Messenger";
import { Model, ModelCore } from "../../core/Model";
import IdCreator from "../IdCreator";
import ExObject from "../../shared/Object";
import Metadata from "../../core/types/Metadata";
import OwnershipInfo from "../types/OwnershipInfo";
import { OrderRepo } from "../repos/OrderRepo";

type OrderData = {
	isDraft?: boolean;
	currency: string;
    customer: string;
    units: string[];
    paymentMethod: string;
    availability: string;
    totalAmount: number;
    assignee: string;
};

type OrderFormDetails = {
	customer: any[];
	availability: any[];
	paymentMethod: any[];
};

class Order extends Model<OrderData> {

	static ROLE = "unit";

	static emptyData(): OrderData {
		return {
			isDraft: true,
			currency: "",
			customer: "",
			units: [],
			paymentMethod: "",
			availability: "",
			totalAmount: 1,
			assignee: ""
		};
	}

	public static create(say: MessengerFunction, data: OrderData, ownership: OwnershipInfo, meta?: Metadata): Order {
		if (ExObject.isDictEmpty(data)) data = Order.emptyData();
		const repository = IdCreator.createBranchedRepoId(OrderRepo.REPO_NAME, ownership.branch || "", ownership.domain);

		const now = Date.now();
		const creator = say(this, "ask", "ownUserId");
		if (!meta) meta = { timeCreated: now, timeUpdated: now, creator };

		const core: ModelCore<OrderData> = { _id: "", repository, role: Order.ROLE, data, meta };
		return new Order(core);
	}

}

export { Order };
export type { OrderData, OrderFormDetails };