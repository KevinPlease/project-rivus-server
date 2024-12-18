import { MessengerFunction } from "../Messenger";
import { ExString } from "../shared/String";
import { OperationStatus } from "../types/Operation";
import File from "./File";
import Folder from "./Folder";
import Path from "./Path";

class ModelFolder extends Folder {

	public static IMG_FOLDER = "images";
	public static DOC_FOLDER = "documents";
	public static GEN_FOLDER = "generated";
	public static TEMP_FOLDER = "temp";

	public static fromInfo(role: string, domainName: string, branchName: string, id: string, say: MessengerFunction) : ModelFolder {
		role = ExString.uncapitalize(role);
		domainName = ExString.uncapitalize(domainName);
		const path = Folder.createPath(say, Folder.SYS_FOLDER, domainName, branchName, role, id);
		const name = Folder.nameFromPath(path);
		return new ModelFolder(path, name);
	}

	
	public getImagesPath(say: MessengerFunction): string {
		return Folder.createPath(say, this.path, ModelFolder.IMG_FOLDER);
	}

	public async ensureImagesExist(say: MessengerFunction) : Promise<string> {
		const opStatus = await this.createFolderIfMissing(ModelFolder.IMG_FOLDER);
		if (opStatus === "failure") return "";

		return this.getImagesPath(say);
	}

	public async ensureImagesAreEmpty(say: MessengerFunction) : Promise<string> {
		const opStatus = await this.createFolderIfMissing(ModelFolder.IMG_FOLDER);
		if (opStatus === "failure") return "";

		await this.deleteAllImages();

		return this.getImagesPath(say);
	}

	public getImageFile(id: string): File {
		return this.getFile(ModelFolder.IMG_FOLDER + Path.FS_SEPARATOR + id);
	}

	public async deleteAllImages(): Promise<OperationStatus> {
		const imagesFolder = this.getChildFolder(ModelFolder.IMG_FOLDER);
		const result = await imagesFolder.removeAllChildren();
		return result === undefined ? "success" : "failure";
	}

	public async deleteAllDocuments(): Promise<OperationStatus> {
		const docFolder = this.getChildFolder(ModelFolder.DOC_FOLDER);
		const result = await docFolder.removeAllChildren();
		return result === undefined ? "success" : "failure";
	}


	public getDocumentsPath(say: MessengerFunction): string {
		return Folder.createPath(say, this.path, ModelFolder.DOC_FOLDER);
	}

	public async ensureDocumentsExist(say: MessengerFunction) : Promise<string> {
		const opStatus = await this.createFolderIfMissing(ModelFolder.DOC_FOLDER);
		if (opStatus === "failure") return "";

		return this.getDocumentsPath(say);
	}

	public async ensureDocumentsAreEmpty(say: MessengerFunction) : Promise<string> {
		const opStatus = await this.createFolderIfMissing(ModelFolder.DOC_FOLDER);
		if (opStatus === "failure") return "";

		await this.deleteAllDocuments();

		return this.getDocumentsPath(say);
	}

	public getDocumentFile(id: string): File {
		return this.getFile(ModelFolder.DOC_FOLDER + Path.FS_SEPARATOR + id);
	}

	public getReportsPath(say: MessengerFunction): string {
		return Folder.createPath(say, this.path, ModelFolder.GEN_FOLDER);
	}

	public async ensureReportsExist(say: MessengerFunction) : Promise<string> {
		const opStatus = await this.createFolderIfMissing(ModelFolder.GEN_FOLDER);
		if (opStatus === "failure") return "";

		return this.getDocumentsPath(say);
	}

	public getReportFile(id: string): File {
		const curModelFolder = this.getChildFolder(ModelFolder.GEN_FOLDER);
		return curModelFolder.getFile(id);
	}

}

export default ModelFolder;
