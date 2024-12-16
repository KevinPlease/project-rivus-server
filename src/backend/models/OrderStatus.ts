import { MessengerFunction } from "../../Messenger";
import { Model, ModelCore } from "../../core/Model";
import IdCreator from "../IdCreator";
import ExObject from "../../shared/Object";
import Metadata from "../../core/types/Metadata";
import OwnershipInfo from "../types/OwnershipInfo";
import { OrderStatusRepo } from "../repos/OrderStatusRepo";

type OrderStatusData = {
	name: string;
	order: number;
};

type OrderStatusFormDetails = {};

class OrderStatus extends Model<OrderStatusData> {

	static ROLE = "orderStatus";

	static emptyData(): OrderStatusData {
		return {
			name: "",
			order: 1
		};
	}

	public static create(say: MessengerFunction, data: OrderStatusData, ownership: OwnershipInfo, meta?: Metadata): OrderStatus {
		if (ExObject.isDictEmpty(data)) data = OrderStatus.emptyData();
		const repository = IdCreator.createRepoId(OrderStatusRepo.REPO_NAME, ownership.domain);

		const now = Date.now();
		const creator = say(this, "ask", "ownUserId");
		if (!meta) meta = { timeCreated: now, timeUpdated: now, creator };

		const core: ModelCore<OrderStatusData> = { _id: "", repository, role: OrderStatus.ROLE, data, meta };
		return new OrderStatus(core);
	}

}

export { OrderStatus };
export type { OrderStatusData, OrderStatusFormDetails };