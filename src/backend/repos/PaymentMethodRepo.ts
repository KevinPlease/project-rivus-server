import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
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
}

export { PaymentMethodRepo };
