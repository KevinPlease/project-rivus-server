import { Model } from "../../core/Model";
import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { Dictionary } from "../../types/Dictionary";
import { OperationStatus } from "../../types/Operation";
import { Counter, CounterData } from "../models/Counter";
import { BaseRepo } from "./BaseRepo";

class CounterRepo extends BaseRepo<CounterData> {
	public static REPO_NAME = "counters";
	public static MODEL_ROLE_NAME = Counter.ROLE;

	public static create(collection: MongoCollection, domain: string) {
		return new CounterRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain);
	}

	public static getInstance(say: MessengerFunction): CounterRepo {
		return super.getInstance(say) as CounterRepo;
	}

	public async findByRole(role: string): Promise<Counter | null> {
		const query = { "data.role": role };
		const core = await this.collection.findOne(query);
		if (!core) return null;

		return new Counter(core);
	}

	public async setDisplayIdToModel(model: Model<Dictionary>, say: MessengerFunction): Promise<OperationStatus> {
		const counter = await this.findByRole(model.role);
		if (!counter) return "failure";

		model.displayId = counter?.data.value || "";
		counter.increment();
		return this.edit(counter.id, counter, say);
	}

	public async addDefaultData(say: MessengerFunction): Promise<OperationStatus> {
		const count = await this.collection.count({});
		if (count > 0) return "success";

		const data: CounterData[] = [
			{
				counter: 1,
				prefix: "RU",
				role: "user",
				value: "RU 1"
			},
			{
				counter: 1,
				prefix: "RR",
				role: "role",
				value: "RR 1"
			},
			{
				counter: 1,
				isDraft: false,
				prefix: "CC",
				role: "customer",
				value: "CC 1"
			},
			{
				counter: 1,
				isDraft: false,
				prefix: "CP",
				role: "property",
				value: "CP 1"
			},
			{
				counter: 1,
				isDraft: false,
				prefix: "CU",
				role: "unit",
				value: "CU 1"
			},
			{
				counter: 1,
				isDraft: false,
				prefix: "CO",
				role: "order",
				value: "CO 1"
			}
		];
		return this.addMany(data, say);
	}
}

export { CounterRepo };
