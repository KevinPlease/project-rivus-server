import { ObjectId } from "mongodb";
import { Model } from "../../core/Model";
import { FileInfo } from "../../files/types/FileInfo";
import { MessengerFunction } from "../../Messenger";
import ExArray from "../../shared/Array";
import { Functions } from "../../shared/Function";
import { Dictionary } from "../../types/Dictionary";
import { Operation, OperationStatus } from "../../types/Operation";
import { BaseRepo } from "./BaseRepo";
import ModelFolder from "../../files/ModelFolder";
import File from "../../files/File";
import { DocumentDetails } from "../types/DocumentDetails";
import { ImageDetails } from "../types/ImageDetails";
import NetworkUrl from "../../network/NetworkUrl";
import ImageEnhancement, { ImgEnhancementExecInfo } from "../../enhancers/ImageEnhancement";

class BaseDocimgRepo<ModelData extends Dictionary> extends BaseRepo<ModelData> {

	private async _editUpload(type: "image" | "document", newDocimgs: DocumentDetails[], model: Model<ModelData>, idQuery: Dictionary, say: MessengerFunction): Promise<OperationStatus> {
		const collection = this.collection;

		const domainName = model.getDomainName();
		const branchName = model.getBranchName();
		const docimgToAdd: DocumentDetails[] = [];
		const docimgToDelete: string[] = [];
		const existingDocimgs = type === "document" ? model.data.documents : model.data.images;
		const sourceFolder = ModelFolder.fromInfo(this.modelRole, domainName, branchName || "", ModelFolder.TEMP_FOLDER, say);
		const destFolder = ModelFolder.fromInfo(this.modelRole, domainName, branchName || "", model.id, say);
		
		const folderMethodName = type === "document" ? "ensureDocumentsExist" : "ensureImagesExist";
		await destFolder[folderMethodName](say);
		
		const fileMethodName = type === "document" ? "getDocumentFile" : "getImageFile";
		const srcMethodName = type === "document" ? "forDocument" : "forImage";
		
		for (const docimg of newDocimgs) {
			const newDocId = docimg.name;
			const existing = existingDocimgs?.find(exDoc => exDoc.name === newDocId);
			if (!existing) {
				const srcFile = sourceFolder[fileMethodName](newDocId);
				const destFile = destFolder[fileMethodName](newDocId);
				const moveStatus = await srcFile.moveTo(destFile.path);
				if (moveStatus !== "success") {
					console.error("Failed moving temp file to permanent location!");
					continue;
				}

				docimg.url = NetworkUrl[srcMethodName](domainName, branchName, this.modelRole, model.id, newDocId, say);
				docimg.isImg = type === "image";
				docimg.alt = "";

				docimgToAdd.push(docimg);
				continue;
			}

			if (docimg.isRemoved) docimgToDelete.push(newDocId);
		}

		const typeInPlural = type + "s";
		let status = await Functions.doSimpleAsync(collection, "removeFromList", idQuery, { [`data.${typeInPlural}`]: { name: { $in: docimgToDelete } } });
		status = await Functions.doSimpleAsync(collection, "pushInList", idQuery, { [`data.${typeInPlural}`]: { $each: docimgToAdd } });
		
		ImageEnhancement.request<ImgEnhancementExecInfo>({
			images: docimgToAdd,
			branch: branchName,
			domain: domainName,
			modelId: model.id,
			model
		}, say);

		return status;
	}

	private handleBeforeEdit(data: Partial<ModelData>): { images: ImageDetails[], documents: DocumentDetails[] } {
		const images: ImageDetails[] = [...(data.images || [])];
		const documents: DocumentDetails[] = [...(data.documents || [])];
		delete data.images;
		delete data.documents;
		return { images, documents };
	}

	private handleAfterEdit(status: OperationStatus, images: ImageDetails[], documents: DocumentDetails[], model: Model<ModelData>, idQuery: Dictionary, say: MessengerFunction): void {
		if (status === "success") {
			if (!ExArray.isEmpty(images)) 	this._editUpload("image", images, model, idQuery, say);

			if (!ExArray.isEmpty(documents)) 	this._editUpload("document", documents, model, idQuery, say);
		}
		
		return;
	}

	public async add(model: Model<ModelData>, say: MessengerFunction): Promise<OperationStatus> {
		const { images, documents } = this.handleBeforeEdit(model.data);
		const status = await super.add(model, say);
		if (!status) return status;
		
		const idQuery = { _id: new ObjectId(model.id) };
		this.handleAfterEdit(status, images, documents, model, idQuery, say);
		return status;
	}

	public async editData(id: string, data: Partial<ModelData>, say: MessengerFunction): Promise<Operation> {
		let newImages: ImageDetails[] = [];
		let newDocuments: DocumentDetails[] = [];

		const existingModel = await this.findById(id, say);
		if (!existingModel) return { status: "failure", message: "NotFound" };
		
		const { images, documents } = this.handleBeforeEdit(data);
		newImages = images;
		newDocuments = documents;
		const operation = await super.editData(id, data, say);
		
		const idQuery = { _id: new ObjectId(id) };
		this.handleAfterEdit(operation.status, newImages, newDocuments, existingModel, idQuery, say);
		
		return operation;
	}

	public async getFileDocById(type: "image" | "document" | "report", branchName: string, owningModelId: string, id: string, say: MessengerFunction): Promise<File | null> {
		const folder = ModelFolder.fromInfo(this.modelRole, this.domain, branchName, owningModelId, say);
		let file: File | null = null;

		if (type === "image") {
			file = folder.getImageFile(id);
		} else if (type === "document") {
			file = folder.getDocumentFile(id);
		} else {
			file = folder.getReportFile(id);
		}
		
		const exists = await file.exists();
		if (!exists) return null;

		return file;
	}
	public getFileDocumentById(branchName:string, owningModelId: string, id: string, say: MessengerFunction): Promise<File | null> {
		return this.getFileDocById("document", branchName, owningModelId, id, say);
	}
	public getFileImageById(branchName:string, owningModelId: string, id: string, say: MessengerFunction): Promise<File | null> {
		return this.getFileDocById("image", branchName, owningModelId, id, say);
	}
	public getFileReportById(branchName:string, owningModelId: string, id: string, say: MessengerFunction): Promise<File | null> {
		return this.getFileDocById("report", branchName, owningModelId, id, say);
	}

	public async getDocById(type: "image" | "document" | "report", branchName:string, owningModelId: string, id: string, say: MessengerFunction): Promise<Operation> {
		const imageFile = await this.getFileDocById(type, branchName, owningModelId, id, say);
		if (!imageFile) return { status: "failure", message: null };

		return { status: "success", message: imageFile.path };
	}
	public getDocumentById(branchName: string, owningModelId: string, id: string, say: MessengerFunction): Promise<Operation> {
		return this.getDocById("document", branchName, owningModelId, id, say);
	}
	public getImageById(branchName: string, owningModelId: string, id: string, say: MessengerFunction): Promise<Operation> {
		return this.getDocById("image", branchName, owningModelId, id, say);
	}
	public getReportById(branchName: string, owningModelId: string, id: string, say: MessengerFunction): Promise<Operation> {
		return this.getDocById("report", branchName, owningModelId, id, say);
	}

	public async getRawImageById(branchName: string, modelId: string, id: string, say: MessengerFunction): Promise<string> {
		const imageFile = await this.getFileImageById(branchName, modelId, id, say);
		if (!imageFile) return "";

		const base64 = await imageFile.readWithEncoding("base64");
		return `data:image;base64,${base64}`;
	}

	public async getRawDocById(branchName: string, modelId: string, id: string, say: MessengerFunction): Promise<string> {
		const docFile = await this.getFileDocumentById(branchName, modelId, id, say);
		if (!docFile) return "";

		const base64 = await docFile.readWithEncoding("base64");
		return `data:text;base64,${base64}`;
	}

	public async getRawReportById(branchName: string, modelId: string, id: string, say: MessengerFunction): Promise<string> {
		const file = await this.getFileReportById(branchName, modelId, id, say);
		if (!file) return "";

		const base64 = await file.readWithEncoding("base64");
		return `data:text;base64,${base64}`;
	}

}

export { BaseDocimgRepo };
