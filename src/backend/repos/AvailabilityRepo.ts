import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { OperationStatus } from "../../types/Operation";
import { Availability, AvailabilityData } from "../models/Availability";
import { BaseRepo } from "./BaseRepo";

class AvailabilityRepo extends BaseRepo<AvailabilityData> {
	public static REPO_NAME = "availabilities";
	public static MODEL_ROLE_NAME = Availability.ROLE;

	public static create(collection: MongoCollection, domain: string) {
		return new AvailabilityRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain);
	}

	public static getInstance(say: MessengerFunction): AvailabilityRepo {
		return super.getInstance(say) as AvailabilityRepo;
	}

	public async addDefaultData(say: MessengerFunction): Promise<OperationStatus> {
		const count = await this.collection.count({});
		if (count > 0) return "success";

		const data: AvailabilityData[] = [
			{
				"name": "Available",
				"order": 1
			},
			{
				"name": "Not Available",
				"order": 2
			},
			{
				"name": "Reserved",
				"order": 1
			},
			{
				"name": "Sold",
				"order": 2
			},
			{
				"name": "Rented Out",
				"order": 2
			}
		];
		return this.addMany(data, say);
	}
}

export { AvailabilityRepo };
