import { MessengerFunction } from "../../Messenger";
import { Dictionary } from "../../types/Dictionary";
import { RepoAccess } from "../types/Access";

interface IPrivilegeMiddleware {
	
	validateUpdateQuery(id: string, query: Dictionary, role: string, say: MessengerFunction): Promise<Dictionary | null>;
	
	validateCreateQuery(query: Dictionary, role: string, say: MessengerFunction): Promise<Dictionary | null>;
	
	getAccessInfo(say: MessengerFunction): Promise<RepoAccess | null>;

}

export default IPrivilegeMiddleware;
