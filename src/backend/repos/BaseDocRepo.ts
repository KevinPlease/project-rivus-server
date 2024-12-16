import { ObjectId } from "mongodb";
import { Model } from "../../core/Model";
import { FileInfo } from "../../files/types/FileInfo";
import { MessengerFunction } from "../../Messenger";
import ExArray from "../../shared/Array";
import { Functions } from "../../shared/Function";
import { Dictionary } from "../../types/Dictionary";
import { Operation, OperationStatus } from "../../types/Operation";
import { BaseRepo, ERepoEvents } from "./BaseRepo";
import ModelFolder from "../../files/ModelFolder";
import File from "../../files/File";
import { DocumentDetails } from "../types/DocumentDetails";
import { ImageDetails } from "../types/ImageDetails";

class BaseDocimgRepo<ModelData extends Dictionary> extends BaseRepo<ModelData> {

	private async _editUpload(type: "image" | "document", newDocimgs: DocumentDetails[], model: Model<ModelData>, idQuery: Dictionary): Promise<OperationStatus> {
		const collection = this.collection;

		const docimgToAdd: DocumentDetails[] = [];
		const docimgToDelete: string[] = [];
		const existingDocimgs = type === "document" ? model.data.documents : model.data.images;
		for (const docimg of newDocimgs) {
			const newDocId = docimg.id;
			const existing = existingDocimgs?.find(exDoc => exDoc.id === newDocId);
			if (!existing) {
				docimgToAdd.push(docimg);
				continue;
			}

			if (docimg.isRemoved) docimgToDelete.push(newDocId);
		}

		const typeInPlural = type + "s";
		let status = await Functions.doSimpleAsync(collection, "removeFromList", idQuery, { [`data.${typeInPlural}`]: { id: { $in: docimgToDelete } } });
		status = await Functions.doSimpleAsync(collection, "pushInList", idQuery, { [`data.${typeInPlural}`]: { $each: docimgToAdd } })

		return status;
	}

	private handleBeforeEdit(data: Partial<ModelData>): { images: ImageDetails[], documents: DocumentDetails[] } {
		const images = [...(data.images || [])];
		const documents = [...(data.documents || [])];
		delete data.images;
		delete data.documents;
		return { images, documents };
	}

	private handleAfterEdit(status: OperationStatus, images: ImageDetails[], documents: DocumentDetails[], model: Model<ModelData>, idQuery: Dictionary) {
		if (status === "success") {
			if (!ExArray.isEmpty(images)) 	this._editUpload("image", images, model, idQuery);

			if (!ExArray.isEmpty(documents)) 	this._editUpload("document", documents, model, idQuery);
		}
		
		return;
	}
	
	private async setDocsFromFiles(type: "image" | "document", id: string, files: FileInfo[], say: MessengerFunction): Promise<OperationStatus> {
		const model = await this.findById(id, say);
		if (!model) return "failure";

		if (ExArray.isEmpty(files)) return "success";

		let finalDocs: DocumentDetails[] | ImageDetails[] = [];
		const existingDocs = type === "document" ? model.data.documents : model.data.images;
		if (existingDocs && !(ExArray.isEmpty(existingDocs))) {
			finalDocs = [...existingDocs];
			for (const fileInfo of finalDocs) {
				const uploadedFile = files.find(file => file.originalName === fileInfo.file.name);
				if (!uploadedFile) continue;

				const fileDetails: DocumentDetails | ImageDetails = {
					alt: fileInfo.alt,
					url: uploadedFile.src,
					src: "",
					isImg: fileInfo.isImg,
					id: uploadedFile.name,
					file: fileInfo.file
				};

				this.dispatch("BEFORE_DOC_UPDATE", fileDetails);

				ExArray.replace(finalDocs, fileInfo, fileDetails);
			}
		} else {
			finalDocs = files.map(f => {
				return {
					alt: "",
					url: f.src,
					src: "",
					isImg: type === "image",
					id: f.name,
					file: { name: f.name, type: f.type, size: f.size }
				};
			}); 
		}

		const typeInPlural = type + "s";
		const updateQuery = { [`data.${typeInPlural}`]: finalDocs };
		return this.update({ _id: new ObjectId(id) }, updateQuery, say);
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
		this.handleAfterEdit(operation.status, newImages, newDocuments, existingModel, idQuery);
		
		return operation;
	}
 
	public setDocumentsFromFiles(id: string, files: FileInfo[], say: MessengerFunction): Promise<OperationStatus> {
		return this.setDocsFromFiles("document", id, files, say);
	}

	public setImagesFromFiles(id: string, files: FileInfo[], say: MessengerFunction): Promise<OperationStatus> {
		return this.setDocsFromFiles("image", id, files, say);
	}

	public async getFileDocById(type: "image" | "document", branchName: string, owningModelId: string, id: string, say: MessengerFunction): Promise<File | null> {
		const folder = ModelFolder.fromInfo(this.modelRole, this.domain, branchName, owningModelId, say);
		const file = type === "document" ? folder.getDocumentFile(id) : folder.getImageFile(id);
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

	public async getDocById(type: "image" | "document", branchName:string, owningModelId: string, id: string, say: MessengerFunction): Promise<Operation> {
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

	public async getRawImageById(branchName: string, propertyId: string, id: string, say: MessengerFunction): Promise<string> {
		const imageFile = await this.getFileImageById(branchName, propertyId, id, say);
		if (!imageFile) return "";

		const base64 = await imageFile.readWithEncoding("base64");
		return `data:image;base64,${base64}`;
	}

	public async getRawDocById(branchName: string, propertyId: string, id: string, say: MessengerFunction): Promise<string> {
		const docFile = await this.getFileDocumentById(branchName, propertyId, id, say);
		if (!docFile) return "";

		const base64 = await docFile.readWithEncoding("base64");
		return `data:text;base64,${base64}`;
	}

}

export { BaseDocimgRepo };
