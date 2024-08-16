import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { Dictionary, GenericDictionary } from "../../types/Dictionary";
import { IRepoOptions } from "../interfaces/IRepository";
import PrivilegeKeeper from "../middlewares/PrivilegeKeeper";
import MongoQuery, { AggregationInfo } from "../models/MongoQuery";
import { Unit, UnitData } from "../models/Unit";
import { DetailedFind } from "../types/DetailedFind";
import { AvailabilityRepo } from "./AvailabilityRepo";
import { BaseDocimgRepo } from "./BaseDocRepo";
import { BuilderRepo } from "./BuilderRepo";
import { CityRepo } from "./CityRepo";
import { CountryRepo } from "./CountryRepo";
import { OfferingTypeRepo } from "./OfferingTypeRepo";
import { PropertyRepo } from "./PropertyRepo";
import { UnitTypeRepo } from "./UnitTypeRepo";
import { UserRepo } from "./UserRepo";


class UnitRepo extends BaseDocimgRepo<UnitData> {
	public static REPO_NAME = "units";
	public static MODEL_ROLE_NAME = Unit.ROLE;

	public static create(collection: MongoCollection, domain: string) {
		const options: IRepoOptions = { needsDisplayIds: true, needsDraftModels: true };
		const repo = new UnitRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain, undefined, options);
		
		repo.middleware = new PrivilegeKeeper();

		return repo;
	}

	public static getInstance(say: MessengerFunction): UnitRepo {
		return super.getInstance(say) as UnitRepo;
	}

	public createAggregation(query: Dictionary, say: MessengerFunction): Dictionary[] {
		const userRepoId = UserRepo.getInstance(say).id;
		const propertyRepoId = PropertyRepo.getInstance(say).id;
		const unitTypeRepoId = UnitTypeRepo.getInstance(say).id;
		const availabilityRepoId = AvailabilityRepo.getInstance(say).id;
		const countryRepoId = CountryRepo.getInstance(say).id;
		const cityRepoId = CityRepo.getInstance(say).id;
		const builderRepoId = BuilderRepo.getInstance(say).id;
		const offeringTypeRepoId = OfferingTypeRepo.getInstance(say).id;

		// TODO: Once all repos are available
		const project = {
			"data.name": 1,
			"repository": 1
		};
		const aggInfo : AggregationInfo[] = [
			{
				repoToJoinFrom: userRepoId,
				fieldToSet: "data.assignee",
				project
			},
			{
				repoToJoinFrom: propertyRepoId,
				fieldToSet: "data.property",
				project
			},
			{
				repoToJoinFrom: unitTypeRepoId,
				fieldToSet: "data.unitType",
				project
			},
			{
				repoToJoinFrom: availabilityRepoId,
				fieldToSet: "data.availability",
				project
			},
			{
				repoToJoinFrom: countryRepoId,
				fieldToSet: "data.country",
				project
			},
			{
				repoToJoinFrom: cityRepoId,
				fieldToSet: "data.city",
				project
			},
			{
				repoToJoinFrom: builderRepoId,
				fieldToSet: "data.builder",
				project
			},
			{
				repoToJoinFrom: offeringTypeRepoId,
				fieldToSet: "data.offeringType",
				project
			}
		];

		const sort = {
			"meta.timeCreated": -1
		};

		return MongoQuery.makeAggregation(aggInfo, query, sort);
	}

	public async getFormDetails(say: MessengerFunction): Promise<GenericDictionary<Dictionary[]>> {
		const userRepo = UserRepo.getInstance(say);
		const assignee = await userRepo.getSimplifiedMany(say);

		const unitTypeRepo = UnitTypeRepo.getInstance(say);
		const unitType = await unitTypeRepo.getSimplifiedMany(say);

		const availabilityRepo = AvailabilityRepo.getInstance(say);
		const availability = await availabilityRepo.getSimplifiedMany(say);

		const countryRepo = CountryRepo.getInstance(say);
		const country = await countryRepo.getSimplifiedMany(say);

		const cityRepo = CityRepo.getInstance(say);
		const city = await cityRepo.getSimplifiedMany(say);

		const builderRepo = BuilderRepo.getInstance(say);
		const builder = await builderRepo.getSimplifiedMany(say);

		const offeringTypeRepo = OfferingTypeRepo.getInstance(say);
		const offeringType = await offeringTypeRepo.getSimplifiedMany(say);

		const propertyRepo = PropertyRepo.getInstance(say);
		const property = await propertyRepo.getSimplifiedMany(say);

		return { assignee, property, unitType, availability, country, city, builder, offeringType };
	}

}

export { UnitRepo };
