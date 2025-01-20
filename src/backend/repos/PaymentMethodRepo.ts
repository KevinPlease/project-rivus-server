import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { OperationStatus } from "../../types/Operation";
import { PaymentMethod, PaymentMethodData } from "../models/PaymentMethod";
import { BaseRepo } from "./BaseRepo";

class PaymentMethodRepo extends BaseRepo<PaymentMethodData> {
	public static REPO_NAME = "paymentMethods";
	public static MODEL_ROLE_NAME = PaymentMethod.ROLE;

	public static create(collection: MongoCollection, domain: string) {
		return new PaymentMethodRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain);
	}

	public static getInstance(say: MessengerFunction): PaymentMethodRepo {
		return super.getInstance(say) as PaymentMethodRepo;
	}

	public async addDefaultData(say: MessengerFunction): Promise<OperationStatus> {
		const count = await this.collection.count({});
		if (count > 0) return "success";

		const data: PaymentMethodData[] = [
			{ "name": "Para Cash", "order": 1 },
			{ "name": "Banke", "order": 1 },
			{ "name": "Karte Krediti", "order": 1 }
		];
		return this.addMany(data, say);
	}
}

export { PaymentMethodRepo };
