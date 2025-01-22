import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import File from "../../files/File";
import { Dictionary, GenericDictionary } from "../../types/Dictionary";
import { Operation, OperationStatus } from "../../types/Operation";
import { IRepoOptions } from "../interfaces/IRepository";
import PrivilegeKeeper from "../middlewares/PrivilegeKeeper";
import MongoQuery, { AggregationInfo } from "../models/MongoQuery";
import { Order, OrderData } from "../models/Order";
import { BaseDocimgRepo } from "./BaseDocRepo";
import { CustomerRepo } from "./CustomerRepo";
import { ProductRepo } from "./ProductRepo";
import { UserRepo } from "./UserRepo";
import { OrderStatusRepo } from "./OrderStatusRepo";
import { CountryRepo } from "./CountryRepo";
import { CityRepo } from "./CityRepo";
import { PaymentMethodRepo } from "./PaymentMethodRepo";
import { OrderPdf } from "../../generators/OrderPdf";
import { Product } from "../models/Product";


class OrderRepo extends BaseDocimgRepo<OrderData> {
	public static REPO_NAME = "orders";
	public static MODEL_ROLE_NAME = Order.ROLE;

	public static create(collection: MongoCollection, domain: string) {
		const options: IRepoOptions = { needsDisplayIds: true };
		const repo = new OrderRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain, undefined, options);
		
		repo.privilegeMiddleware = new PrivilegeKeeper();

		return repo;
	}

	public static getInstance(say: MessengerFunction): OrderRepo {
		return super.getInstance(say) as OrderRepo;
	}

	public createAggregation(query: Dictionary, say: MessengerFunction): Dictionary[] {
		const userRepoId = UserRepo.getInstance(say).id;
		const customerRepoId = CustomerRepo.getInstance(say).id;
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

		const paymentMethodRepo = PaymentMethodRepo.getInstance(say);
		const paymentMethod = await paymentMethodRepo.getSimplifiedMany(say);

		const orderStatusRepo = OrderStatusRepo.getInstance(say);
		const orderStatus = await orderStatusRepo.getSimplifiedMany(say);
		
		const countryRepo = CountryRepo.getInstance(say);
		const country = await countryRepo.getSimplifiedMany(say);

		const cityRepo = CityRepo.getInstance(say);
		const city = await cityRepo.getSimplifiedMany(say);

		const productRepo = ProductRepo.getInstance(say); 
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
		const product = await productRepo.getSimplifiedMany(say);

		return { assignee, city, country, customer, paymentMethod, product, orderStatus };
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
		const productRepo = ProductRepo.getInstance(say);
		const products = await Promise.all(
			detailedOrder.model.data.products.map(u => productRepo.findById(u._id || "", say))
		);
		if (products.some(u => u === null || u === undefined)) {
			return { status: "failure", message: "Problem getting products' information!" };
		} 

		detailedOrder.model.data.products = products as Product[];
		const pdfGenOperation = await orderPdf.generate(detailedOrder, id, say);
		if (pdfGenOperation.status === "failure") return { status: "failure", message: "Problem generating the report!" };

		const reportFile = File.fromPath(pdfGenOperation.message);
		return { status: "success", message: reportFile };
	}

}

export { OrderRepo };
