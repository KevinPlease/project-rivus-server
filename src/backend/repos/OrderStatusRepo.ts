import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { OperationStatus } from "../../types/Operation";
import { OrderStatus, OrderStatusData } from "../models/OrderStatus";
import { BaseRepo } from "./BaseRepo";

class OrderStatusRepo extends BaseRepo<OrderStatusData> {
	public static REPO_NAME = "orderStatuses";
	public static MODEL_ROLE_NAME = OrderStatus.ROLE;

	public static create(collection: MongoCollection, domain: string) {
		return new OrderStatusRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain);
	}

	public static getInstance(say: MessengerFunction): OrderStatusRepo {
		return super.getInstance(say) as OrderStatusRepo;
	}

	public async addDefaultData(say: MessengerFunction): Promise<OperationStatus> {
		const count = await this.collection.count({});
		if (count > 0) return "success";

		const data: OrderStatusData[] = [
			{ "name": "Reserved", "order": 1 },
			{ "name": "Purchased", "order": 1 }
		];
		return this.addMany(data, say);
	}
}

export { OrderStatusRepo };
