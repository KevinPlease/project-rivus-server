import Multer from "multer";

import File from "../../files/File";
import { MessengerFunction } from "../../Messenger";
import { MExpRequest } from "../../network/types/MExpRequest";
import NetworkUrl from "../../network/NetworkUrl";
import ModelFolder from "../../files/ModelFolder";
import IMiddlewareStorage from "./IMiddlewareStorage";

class DocumentStorage implements IMiddlewareStorage {
	private _storage: Multer.StorageEngine | null;
	private _role: string;

	constructor(modelRole: string) {
		this._role = modelRole;
		this._storage = null;
	}

	public get storage(): Multer.StorageEngine | null { return this._storage }

	public init(say: MessengerFunction): DocumentStorage {
		const ownDomain = say(DocumentStorage, "ask", "ownDomain");
		const ownBranch = say(DocumentStorage, "ask", "ownBranch");
		let firstTime = true;

		const role = this._role;
		const storage = Multer.diskStorage({
			destination: async function (req, file, destHandlerFunc) {
				const tempFolder = ModelFolder.fromInfo(role, ownDomain.name, ownBranch.data.name, ModelFolder.TEMP_FOLDER, say);
				
				if (firstTime) {
					await tempFolder.ensureDocumentsExist(say);
					firstTime = false;
				}
				
				const path = tempFolder.getDocumentsPath(say);
				const fileName = File.timestampedName(file.originalname);
				
				file.filename = fileName;
				file.path = NetworkUrl.forDocument(ownDomain.name, ownBranch.data.name, role, ModelFolder.TEMP_FOLDER, fileName, say);
				destHandlerFunc(null, path);
			},
			filename: function (req: MExpRequest, file, nameHandlerFunc) {
				nameHandlerFunc(null, file.filename);
			}
		});

		this._storage = storage;
		return this;
	}
}

export default DocumentStorage;
