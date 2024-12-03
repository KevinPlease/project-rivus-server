import { OrderPdf } from "../../generators/OrderPdf";
import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import File from "../../files/File";
import { Dictionary, GenericDictionary } from "../../types/Dictionary";
import { Operation, OperationStatus } from "../../types/Operation";
import { IRepoOptions } from "../interfaces/IRepository";
import PrivilegeKeeper from "../middlewares/PrivilegeKeeper";
import MongoQuery, { AggregationInfo } from "../models/MongoQuery";
import { Order, OrderData } from "../models/Order";
import { AvailabilityRepo } from "./AvailabilityRepo";
import { BaseDocimgRepo } from "./BaseDocRepo";
import { ERepoEvents } from "./BaseRepo";
import { CustomerRepo } from "./CustomerRepo";
import { PaymentMethodRepo } from "./PaymentMethodRepo";
import { UnitRepo } from "./UnitRepo";
import { UserRepo } from "./UserRepo";
import { OrderStatusRepo } from "./OrderStatusRepo";
import { Unit } from "../models/Unit";
import { PropertyRepo } from "./PropertyRepo";
import { UnitTypeRepo } from "./UnitTypeRepo";


class OrderRepo extends BaseDocimgRepo<OrderData> {
	public static REPO_NAME = "orders";
	public static MODEL_ROLE_NAME = Order.ROLE;

	public static create(collection: MongoCollection, domain: string) {
		const options: IRepoOptions = { needsDisplayIds: true, needsDraftModels: true };
		const repo = new OrderRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain, undefined, options);
		
		repo.privilegeMiddleware = new PrivilegeKeeper();

		return repo;
	}

	public static getInstance(say: MessengerFunction): OrderRepo {
		return super.getInstance(say) as OrderRepo;
	}

	public async editData(id: string, data: Partial<OrderData>, say: MessengerFunction): Promise<Operation> {
		const self = this;
		this.subscribeOnce(ERepoEvents.AFTER_UPDATE, async (source: Object, m: { model: Order }) => {
			// NOTE: Test log to determine if this subscriber is called from different model operations
			if (id !== m.model.id) throw "MISMATCHING IDS IN SUBSCRIBER EVENT!";

			self.dispatch("order touched", { type: "update", order: m.model, data });
			return "success";
		});

		return super.editData(id, data, say);
	}

	public async remove(id: string, say: MessengerFunction): Promise<OperationStatus> {
		const self = this;
		const existingModel = await this.findById(id, say);

		this.subscribeOnce(ERepoEvents.AFTER_REMOVE, async (source: Object, m: { id: string, status: OperationStatus }) => {
			// NOTE: Test log to determine if this subscriber is called from different model operations
			if (id !== m.id) throw "MISMATCHING IDS IN SUBSCRIBER EVENT!";

			if (m.status) self.dispatch("order touched", { type: "delete", order: existingModel });
			return "success";
		});
		return super.remove(id, say);
	}

	public createAggregation(query: Dictionary, say: MessengerFunction): Dictionary[] {
		const userRepoId = UserRepo.getInstance(say).id;
		const customerRepoId = CustomerRepo.getInstance(say).id;
		const availabilityRepoId = AvailabilityRepo.getInstance(say).id;
		const paymentMethodRepoId = PaymentMethodRepo.getInstance(say).id;
		const orderStatusRepoId = OrderStatusRepo.getInstance(say).id;

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
				repoToJoinFrom: customerRepoId,
				fieldToSet: "data.customer",
				project
			},
			{
				repoToJoinFrom: availabilityRepoId,
				fieldToSet: "data.availability",
				project
			},
			{
				repoToJoinFrom: paymentMethodRepoId,
				fieldToSet: "data.paymentMethod",
				project
			},
			{
				repoToJoinFrom: orderStatusRepoId,
				fieldToSet: "data.orderStatus",
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

		const customerRepo = CustomerRepo.getInstance(say);
		const customer = await customerRepo.getSimplifiedMany(say);

		const availabilityRepo = AvailabilityRepo.getInstance(say);
		const availability = await availabilityRepo.getSimplifiedMany(say);

		const paymentMethodRepo = PaymentMethodRepo.getInstance(say);
		const paymentMethod = await paymentMethodRepo.getSimplifiedMany(say);

		const orderStatusRepo = OrderStatusRepo.getInstance(say);
		const orderStatus = await orderStatusRepo.getSimplifiedMany(say);
		
		const propertyRepo = PropertyRepo.getInstance(say);
		const property = await propertyRepo.getSimplifiedMany(say);
		
		const unitTypeRepo = UnitTypeRepo.getInstance(say);
		const unitType = await unitTypeRepo.getSimplifiedMany(say);

		const unitRepo = UnitRepo.getInstance(say); 
		// const unitFilter: Filter = {
		// 	type: FilterType.CONJUNCTION,
		// 	data: {
		// 		availability: {
		// 			comparator: "INCLUDES",
		// 			type: "basic",
		// 			values: ["66be60c2f80c0b00b38cc2fb"]
		// 		}
		// 	}
		// };
		const unit = await unitRepo.getSimplifiedMany(say);

		return { assignee, customer, availability, paymentMethod, unit, orderStatus, property, unitType };
	}

	public async generateReportById(owningModelId: string, id: string, say: MessengerFunction): Promise<Operation> {
		const detailedOrder = await this.detailedFindById(owningModelId, say);
		if (!detailedOrder) return { status: "failure", message: "No Order found for that id." };

		const domain = say(this, "ask", "ownDomain");
		const branch = say(this, "ask", "ownBranch");
		const fileId = File.basicName(id + ".pdf");
		const existingReport = await this.getFileReportById(branch.data.name, owningModelId, fileId, say);
		if (existingReport) return { status: "success", message: existingReport };
		
		const orderPdf = new OrderPdf({ domain, branch }, say);
		const unitRepo = UnitRepo.getInstance(say);
		const units = await Promise.all(
			detailedOrder.model.data.units.map(u => unitRepo.findById(u._id || "", say))
		);
		if (units.some(u => u === null || u === undefined)) {
			return { status: "failure", message: "Problem getting units' information!" };
		} 

		detailedOrder.model.data.units = units as Unit[];
		const pdfGenOperation = await orderPdf.generate(detailedOrder, id, say);
		if (pdfGenOperation.status === "failure") return { status: "failure", message: "Problem generating the report!" };

		const reportFile = File.fromPath(pdfGenOperation.message);
		return { status: "success", message: reportFile };
	}

}

export { OrderRepo };
