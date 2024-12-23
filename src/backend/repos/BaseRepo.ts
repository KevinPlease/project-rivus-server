import { ObjectId } from "mongodb";
import { Communicator } from "../../communications/Communicator";
import { Model, ModelCore } from "../../core/Model";
import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { ExString } from "../../shared/String";
import { Dictionary, GenericDictionary } from "../../types/Dictionary";
import { OperationStatus, Operation } from "../../types/Operation";
import IdCreator from "../IdCreator";
import IPrivilegeMiddleware from "../interfaces/IPrivilegeMiddleware";
import IRepository, { IRepoOptions } from "../interfaces/IRepository";
import { Branch } from "../models/Branch";
import MongoQuery, { AggregationInfo } from "../models/MongoQuery";
import { AccessType } from "../types/Access";
import { DetailedFind, DetailedGetMany } from "../types/DetailedFind";
import { Filter } from "../types/Filter";
import { PaginationOptions } from "../types/PaginationOptions";

enum ERepoEvents {
	BEFORE_UPDATE = "BEFORE_UPDATE",
	AFTER_UPDATE = "AFTER_UPDATE",
	BEFORE_ADD = "BEFORE_ADD",
	AFTER_ADD = "AFTER_ADD",
	BEFORE_REMOVE = "BEFORE_REMOVE",
	AFTER_REMOVE = "AFTER_REMOVE"
}

class BaseRepo<ModelData extends Dictionary> extends Communicator implements IRepository<ModelData> {
	public static REPO_NAME = "_bases";
	public static MODEL_ROLE_NAME = "_base";
	
	private _collection: MongoCollection;
	private _repoName: string;
	private _modelRole: string;
	private _branch?: string;
	private _domain: string;
	private _id: string;
	private _lastUpdated?: number | undefined;
	
	public privilegeMiddleware?: IPrivilegeMiddleware | undefined;
	public options: IRepoOptions;

	constructor(newCollection: MongoCollection, repoName: string, modelRole: string, domain: string, branch?: string, options?: IRepoOptions) {
		super();

		this._repoName = repoName;
		this._modelRole = modelRole;
		this._collection = newCollection;
		this._domain = domain;
		this._branch = branch;
		this._id = branch ? IdCreator.createBranchedRepoId(repoName, branch, domain) : IdCreator.createRepoId(repoName, domain);
		this.options = options || {};
	}
	

	public get collection(): MongoCollection { return this._collection }
	public set collection(value: MongoCollection) { this._collection = value }
	public get branch(): string | undefined { return this._branch }
	public get domain(): string { return this._domain }
	public get repoName(): string { return this._repoName }
	public get modelRole(): string { return this._modelRole }
	public get id(): string { return this._id }
	public get lastUpdated(): number { return this._lastUpdated || 0 }

	public static create(collection: MongoCollection, domain: string, branch?: string, options?: IRepoOptions) {
		return new BaseRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain, branch, options);
	}

	public static getInstance(say: MessengerFunction): BaseRepo<Dictionary> {
		return say(this, "ask", "repo", this.REPO_NAME);
	}

	private async _create(data: Dictionary, say: MessengerFunction): Promise<string | null> {
		const operation: Operation = await this.dispatchOnce(ERepoEvents.BEFORE_ADD, { model: data, status: "success" });
		if (operation?.status === "failure") return "failure";
		
		const middleware = this.privilegeMiddleware;
		const isSysCall = say(this, "ask", "isSysCall");
		let result: string | null = null;
		if (!middleware || isSysCall === true) {
			result = await this._collection.insertOne(data);
		} else {
			const createQuery = await middleware.validateCreateQuery(data, this.modelRole, say) || data;
			result = await this._collection.insertOne(createQuery);
		}

		data.id = result;
		this.dispatchOnce(ERepoEvents.AFTER_ADD, { model: data, status: result ? "success" : "failure" });

		return result;
	}
	
	public async _read(query: Dictionary, say: MessengerFunction, project?: Dictionary): Promise<ModelCore<ModelData> | null> {
		const middleware = this.privilegeMiddleware;
		const isSysCall = say(this, "ask", "isSysCall");
		if (!middleware || isSysCall === true) return this._collection.findOne(query, project);

		const repoAccess = await middleware.getAccessInfo(say);
		if (!repoAccess) return null;

		const aggregation = MongoQuery.makePrivilegedAggregation(repoAccess, this._repoName, this._modelRole, query, say);
		return this._collection.findOneAsAggregation(aggregation);
	}
	
	public async _readMany(say: MessengerFunction, query?: Dictionary, project?: Dictionary, sort?: Dictionary, pagination?: PaginationOptions): Promise<ModelCore<ModelData>[]> {
		const middleware = this.privilegeMiddleware;
		const isSysCall = say(this, "ask", "isSysCall");
		if (!middleware || isSysCall === true) return this._collection.getMany(query, pagination, project, sort);

		const repoAccess = await middleware.getAccessInfo(say);
		if (!repoAccess) return [];

		const aggregation = MongoQuery.makePrivilegedAggregation(repoAccess, this._repoName, this._modelRole, query, say);
		return this._collection.getManyAsAggregation(aggregation, pagination, sort, project);
	}
	public async _readManyAsAggregation(exAggregation: Dictionary[], say: MessengerFunction, pagination?: PaginationOptions): Promise<ModelCore<ModelData>[]> {
		const middleware = this.privilegeMiddleware;
		const isSysCall = say(this, "ask", "isSysCall");
		if (!middleware || isSysCall === true) return this._collection.getManyAsAggregation(exAggregation, pagination);

		const repoAccess = await middleware.getAccessInfo(say);
		if (!repoAccess) return [];

		const aggregation = MongoQuery.makePrivilegedAggregation(repoAccess, this._repoName, this._modelRole, {}, say);
		const finalAggregation = aggregation.concat(exAggregation);
		return this._collection.getManyAsAggregation(finalAggregation, pagination);
	}

	public async _readAsAggregation(exAggregation: Dictionary[], say: MessengerFunction, project?: Dictionary): Promise<ModelCore<ModelData> | null> {
		const middleware = this.privilegeMiddleware;
		const isSysCall = say(this, "ask", "isSysCall");
		if (!middleware || isSysCall === true) return this._collection.findOneAsAggregation(exAggregation);

		const repoAccess = await middleware.getAccessInfo(say);
		if (!repoAccess) return null;

		const aggregation = MongoQuery.makePrivilegedAggregation(repoAccess, this._repoName, this._modelRole, {}, say);
		const finalAggregation = aggregation.concat(exAggregation);
		return this._collection.findOneAsAggregation(finalAggregation);
	}

	public createQueryFromFilter(filter: Filter | Filter[] | undefined): Dictionary {
		return MongoQuery.create(filter);
	}

	public async update(query: Dictionary, data: Dictionary, existingModel: Model<ModelData>, say: MessengerFunction): Promise<OperationStatus> {
		const status = await this.dispatchOnce(ERepoEvents.BEFORE_UPDATE, { id: query._id.toString(), data, status: "success" });
		if (status === "failure") return "failure";

		const middleware = this.privilegeMiddleware;
		const isSysCall = say(this, "ask", "isSysCall");
		let result: OperationStatus = "failure";
		if (!middleware || isSysCall === true) {
			result = await this._collection.updateOne(query, data);
		
		} else {
			const repoAccess = await middleware.getAccessInfo(say);
			if (!repoAccess) return "failure";
		
			const core = await this._read(query, say);
			if (!core) return "failure";
	
			const userId = say(this, "ask", "ownUserId");
			const accessInfo = repoAccess[ ExString.betweenFirstTwo(core.repository, "/", "@") ];
			const isOverseerUpdate = accessInfo.global[this.modelRole].write === AccessType.OVERSEER;
			const isSelfishUpdate = accessInfo.global[this.modelRole].write === AccessType.SELFISH && (core.data.assignee === userId || core.meta.creator === userId);
			if (isOverseerUpdate || isSelfishUpdate) {
				const updateQuery = await middleware.validateUpdateQuery(query._id, data, this.modelRole, say) || data;
				result = await this._collection.updateOne(query, updateQuery);
			}
		}

		this.dispatchOnce(ERepoEvents.AFTER_UPDATE, { id: query._id.toString(), data, model: existingModel, status: result });

		return result;
	}

	private async _delete(query: Dictionary, say: MessengerFunction): Promise<OperationStatus> {
		const model = await this._read(query, say);
		if (model === null) return "failure";

		let status = await this.dispatchOnce(ERepoEvents.BEFORE_REMOVE, { id: model._id, status: "success" });
		if (status === "failure") return "failure";

		status = await this._collection.deleteMany(query);

		this.dispatchOnce(ERepoEvents.AFTER_REMOVE, { model, status: status });

		return status;
	}

	public createAggregation(query: Dictionary, say: MessengerFunction): Dictionary[] {
		console.info(`${this.repoName}#createAggregation -> CHECK if this should be custom implemented?`);

		const aggInfo : AggregationInfo[] = [];

		const sort = {
			"meta.timeCreated": -1
		};

		return MongoQuery.makeAggregation(aggInfo, query, sort);
	}

	public async add(model: Model<ModelData>, say: MessengerFunction): Promise<OperationStatus> {
		if (this.options.needsDisplayIds) {
			// NOTE: cyclic dependency if importing CounterRepo, therefore we use direct dependency injection
			const counterRepo = say(this, "ask", "repo", "counters");
			const status = await counterRepo.setDisplayIdToModel(model, say);
			if (status === "failure") return status;

		}

		const timeCreated = Date.now();
		model.meta.timeCreated = timeCreated;
		const insertedId = await this._create(model, say);
		if (!insertedId) return "failure";

		if (this.options.needsLastUpdateTime) {
			this._lastUpdated = timeCreated;
		}

		return "success";
	}

	public addMany(dataArr: ModelData[], say: MessengerFunction): Promise<OperationStatus> {
		const branch: Branch = say(this, "ask", "ownBranch");
		const domainName = this._domain;
		const modelRole = this._modelRole;
		const repoName = this._repoName;
		const cores = dataArr.map(data => Model._create(say, data, repoName, modelRole, { domain: domainName, branch: branch.data?.name }).toNoIdJSON());
		return this._collection.insertMany(cores);
	}

	public async edit(id: string, model: Model<ModelData>, say: MessengerFunction): Promise<OperationStatus> {
		if (this.options.needsLastUpdateTime) {
			this._lastUpdated = Date.now();
		}

		model.meta.timeUpdated = Date.now();
		return this.update({ _id: new ObjectId(id) }, model, model, say);
	}

	public async editData(id: string, data: Partial<ModelData>, say: MessengerFunction): Promise<Operation> {
		if (this.options.needsLastUpdateTime) {
			this._lastUpdated = Date.now();
		}
		
		const meta: Dictionary = { timeUpdated: Date.now() };
		const existingModel = await this.findById(id, say);
		if (!existingModel) return { status: "failure", message: "" };

		if (existingModel.meta.timeCreated === 0) {
			meta.timeCreated = meta.timeUpdated;
		}

		const query = MongoQuery.createUpdateData({ meta, data });
		const idQuery = { _id: new ObjectId(id) };
		const status = await this.update(idQuery, query, existingModel, say);
		return { status, message: status ? "Success!" : "Failed to Update!" };
	}
	
	public get(filter: Filter, say: MessengerFunction): Promise<ModelCore<ModelData> | null> {
		const query = this.createQueryFromFilter(filter);
		return this._read(query, say);
	}

	public getMany(say: MessengerFunction, filter?: Filter | undefined, pagination?: PaginationOptions | undefined): Promise<ModelCore<ModelData>[]> {
		const query = this.createQueryFromFilter(filter);
		const aggregation = this.createAggregation(query, say);
		return this._readManyAsAggregation(aggregation, say, pagination);
	}

	public async detailedGetMany(say: MessengerFunction, filter?: Filter | Dictionary, pagination?: PaginationOptions): Promise<DetailedGetMany<ModelCore<ModelData>>> {
		const cores = await this.getMany(say, filter, pagination);
		const formDetails = await this.getFormDetails(say);
		
		const count = cores[0]?.totalCount || 0;
		return { count, formDetails, models: cores };
	}

	public getSimplifiedMany(say: MessengerFunction, filter?: Filter | Dictionary, pagination?: PaginationOptions, project?: Dictionary): Promise<Dictionary[]> {
		const query = this.createQueryFromFilter(filter);
		
		if (!project) project = {};
		
		const overrideProject = { "_id": 1, "data.name": 1, "repository": 1, "meta": 1, "displayId": 1, ...project };
		return this._readMany(say, query, overrideProject, undefined, pagination);
	}

	public async getFormDetails(say: MessengerFunction): Promise<GenericDictionary<Dictionary[]>> {
		throw "BaseRepo -> MUST be custom implemented for each Repo!";

		// return { source: [], assignee: [] };
	}

	public async remove(id: string, say: MessengerFunction): Promise<OperationStatus> {
		await this.dispatch(ERepoEvents.BEFORE_REMOVE, { id });
		
		const status = await this._delete({ _id: new ObjectId(id) }, say);
		
		this.dispatch(ERepoEvents.AFTER_REMOVE, { id, status });
		
		return status;
	}

	public async findById(id: string, say: MessengerFunction, projection?: Dictionary): Promise<Model<ModelData> | null> {
		const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { displayId: id };
		const core = await this._read(query, say, projection);
		if (!core) return null;

		return new Model(core);
	}

	public async findByName(name: string, say: MessengerFunction): Promise<Model<ModelData> | null> {
		const query = { "data.name": name };
		const core = await this._read(query, say);
		if (!core) return null;

		return new Model(core);
	}

	// TODO: Consider adapting this to use _readAsAggregation instead AND support for Events.
	public async detailedFind(query: Dictionary, say: MessengerFunction): Promise<DetailedFind<Model<ModelData>> | null> {
		const core = await this._read(query, say);
		if (!core) return null;

		const model = new Model(core);
		const formDetails = await this.getFormDetails(say);
		return { formDetails, model };
	}

	public detailedFindById(id: string, say: MessengerFunction): Promise<DetailedFind<Model<ModelData>> | null> {
		const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { displayId: id };
		return this.detailedFind(query, say);
	}

	public async addDefaultData(say: MessengerFunction): Promise<OperationStatus> {
		console.info(`${this.repoName}#addDefaultData -> CHECK if this should be custom implemented?`);
		return "success";
	}

}

export { BaseRepo, ERepoEvents };
