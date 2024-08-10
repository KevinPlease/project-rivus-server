import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
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
}

export { AvailabilityRepo };
