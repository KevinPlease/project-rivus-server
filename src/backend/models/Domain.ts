import DomainDb from "../DomainDb";
import { Model, ModelCore } from "../../core/Model";
import { MessengerFunction } from "../../Messenger";
import { OperationStatus } from "../../shared/Function";
import IdCreator from "../IdCreator";
import { ExString } from "../../shared/String";
import { RoleRepo } from "../repos/RoleRepo";
import { BranchRepo } from "../repos/BranchRepo";
import Cache from "../../core/Cache";
import { Branch } from "./Branch";
import IRepository, { IRepoOptions } from "../interfaces/IRepository";
import { Dictionary } from "../../types/Dictionary";
import { CounterRepo } from "../repos/CounterRepo";
import { UserRepo } from "../repos/UserRepo";
import { BaseRepo } from "../repos/BaseRepo";
import MongoCollection from "../../mongo/MongoCollection";

const SYS_NAME = process.env.SYS_NAME || "";
if (!SYS_NAME) throw "Missing environment variable for SYS_NAME!";

type RepositoryConstructor = {
	REPO_NAME: string;
	create(collection: MongoCollection, domain: string, branch?: string, options?: IRepoOptions): BaseRepo<Dictionary>;
}

type DomainData = {
	branches: string[],
	name: string,
	username: string,
	password: string
};

class Domain extends Model<DomainData> {
	public static ROLE = "domain";

	private _branchesCache: Cache<Branch>;
	private _repoCache: Cache<BaseRepo<Dictionary>>;
	private _database: DomainDb;
	
	constructor(core: ModelCore<DomainData>, domainDb: DomainDb) {
		super(core);
		
		this._branchesCache = new Cache();
		this._repoCache = new Cache();
		
		this._database = domainDb;
	}

	public get database(): DomainDb { return this._database }
	public get name(): string { return this.data.name }

	static create(data: DomainData, say: MessengerFunction): Domain {
		const name = data.name;
		const lowcaseName = name.toLowerCase();
		const repository = SYS_NAME.toLowerCase() + "_domains";
		const repoName = "domains";
		const model = Model._create(say, data, repository, repoName);
		model.id = lowcaseName;

		const domainDb = DomainDb.create(lowcaseName, { username: data.username, password: data.password }, say);
		return new Domain(model.toJSON(), domainDb);
	}

	static async createAndConnect(data: DomainData, repositories: RepositoryConstructor[], say: MessengerFunction): Promise<Domain> {
		const name = data.name;
		const domain = Domain.create(data, say);
		const status = await domain.connectDb(say);
		if (status === "failure") throw `Problem connecting to domain database: ${name}!`;

		return domain.initializeRepositories(repositories, say);
	}

	static async createSystem(say: MessengerFunction): Promise<Domain> {
		const credentials = say(this, "ask", "credentials");
		const data: DomainData = { name: SYS_NAME, branches: [], username: credentials.username, password: credentials.password };
		const domain = Domain.create(data, say);
		const result = await domain.database.connect();
		if (!result) throw "Problem connecting to system_db";

		return domain;
	}

	static byName(domainName: string, say: MessengerFunction): Domain {
		return say(this, "ask", "domainByName", domainName);
	}

	static fromUserId(userId: string, say: MessengerFunction): Domain | undefined {
		const domainName = ExString.upToBefore(userId, ".");
		return Domain.byName(domainName, say);
	}

	static system(say: MessengerFunction): Domain { return Domain.byName(SYS_NAME, say) }

	private async initializeRepositories(repositories: RepositoryConstructor[], say: MessengerFunction) : Promise<Domain> {
		const domainName = this.name;
		const db = this.database.db;

		const branchRepoId = IdCreator.createRepoId(BranchRepo.REPO_NAME, domainName);
		const branchColl = db.getCollection(branchRepoId);
		const branchRepo = BranchRepo.create(branchColl, domainName);
		this._repoCache.set(branchRepo, branchRepo.repoName);

		const branchCores = await branchRepo.getMany(say);
		for (const branchCore of branchCores) {
			const branch = new Branch(branchCore);
			this._branchesCache.set(branch, branch.data.name);
		}

		for (const Repository of repositories) {
			const repoId = IdCreator.createRepoId(Repository.REPO_NAME, domainName);
			const dbCollection = db.getCollection(repoId);
			const counterRepo = Repository.create(dbCollection, domainName);
			this._repoCache.set(counterRepo, counterRepo.repoName);
			await counterRepo.addDefaultData(say);
		}

		this.dispatch("domain connected", this);
		return this;
	}

	public getBranchByName(name: string) : Branch {
		return this._branchesCache.getBy(name);
	}

	public getAllBranches() : Branch[] {
		return this._branchesCache.getAll();
	}

	public addBranchRef(subjectDomain: Domain, branch: Branch): Promise<OperationStatus> {
		if (this.name !== SYS_NAME) throw "BAD CALL: addBranchRef must be called from system Domain only!";

		const updateQuery = { "data.branches": branch.id };
		const idQuery = { "data.name": subjectDomain.name };
		const domainColl = this.database.db.getCollection("domains");
		return domainColl.pushInList(idQuery, updateQuery);
	}

	public getRepoByName(name: string): BaseRepo<Dictionary> | null {
		return this._repoCache.getBy(name);
	}

	connectDb(say: MessengerFunction): Promise<OperationStatus> { return this.database.safeConnect(say) }

}

export { Domain };
export type { DomainData };
