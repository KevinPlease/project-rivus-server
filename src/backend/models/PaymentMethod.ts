import { MessengerFunction } from "../../Messenger";
import { Model, ModelCore } from "../../core/Model";
import IdCreator from "../IdCreator";
import ExObject from "../../shared/Object";
import Metadata from "../../core/types/Metadata";
import OwnershipInfo from "../types/OwnershipInfo";
import { PaymentMethodRepo } from "../repos/PaymentMethodRepo";

type PaymentMethodData = {
	isDraft?: boolean;
	name: string;
};

type PaymentMethodFormDetails = {};

class PaymentMethod extends Model<PaymentMethodData> {

	static ROLE = "paymentMethod";

	static emptyData(): PaymentMethodData {
		return {
			isDraft: true,
			name: ""
		};
	}

	public static create(say: MessengerFunction, data: PaymentMethodData, ownership: OwnershipInfo, meta?: Metadata): PaymentMethod {
		if (ExObject.isDictEmpty(data)) data = PaymentMethod.emptyData();
		const repository = IdCreator.createRepoId(PaymentMethodRepo.REPO_NAME, ownership.domain);

		const now = Date.now();
		const creator = say(this, "ask", "ownUserId");
		if (!meta) meta = { timeCreated: now, timeUpdated: now, creator };

		const core: ModelCore<PaymentMethodData> = { _id: "", repository, role: PaymentMethod.ROLE, data, meta };
		return new PaymentMethod(core);
	}

}

export { PaymentMethod };
export type { PaymentMethodData, PaymentMethodFormDetails };