import PDFDocument from "pdfkit";
import IDocGenerator from "../backend/interfaces/IDocGenerator";
import { DocType } from "../backend/types/DocType";
import { Model } from "../core/Model";
import { MessengerFunction } from "../Messenger";
import { Dictionary } from "../types/Dictionary";
import { Operation } from "../types/Operation";
import ModelFolder from "../files/ModelFolder";
import File from "../files/File";
import Folder from "../files/Folder";

class PdfGenerator implements IDocGenerator {

	private _type: DocType;
	private _options: Dictionary;
	private _doc: PDFKit.PDFDocument;

	constructor(options: Dictionary) {
		this._type = "pdf";
		this._options = options;

		const docOptions = {
			size: "A4",
			margin: 50
		};
		this._doc = new PDFDocument(docOptions);
	}

	public get type(): DocType { return this._type }
	public set type(value: DocType) { this._type = value }
	public get options(): Dictionary { return this._options }
	public set options(value: Dictionary) { this._options = value }
	public get doc(): PDFKit.PDFDocument { return this._doc }
	public set doc(value: PDFKit.PDFDocument) { this._doc = value }

	private async prepareFileStream(model: Model<Dictionary> | Dictionary, reportId: string, say: MessengerFunction): Promise<Operation> {
		const domain = this.options.domain;
		const branch = this.options.branch;
		const folder = ModelFolder.fromInfo(model.role, domain.name, branch.data.name, model.id, say);
		
		await folder.ensureReportsExist(say);

		const fileName = File.basicName(reportId + ".pdf");
		return folder.getReportFile(fileName).openAsWriteStream();
	}

	public addHeader(model: Model<Dictionary> | Dictionary, say: MessengerFunction): PdfGenerator {
		const options = this._options;
		const domain = options.domain;
		const branch = options.branch;
		const domainName = domain.name;

		this._doc
			.image("shared/icons/Logo_01.png", 50, 45, { width: 50 })
			.fillColor("#444444")
			.fontSize(20)
			.text(domainName, 110, 57)
			.fontSize(10)
			.text(domainName, 200, 50, { align: "right" })
			.text(`Dega '${branch.data.name}'`, 200, 65, { align: "right" })
			.text(branch.data.address || "", 200, 80, { align: "right" })
			.moveDown();
		
		return this;
	}

	public addBody(model: Model<Dictionary> | Dictionary): PdfGenerator {
		// CUSTOM IMPLEMENTATION BY CHILD
		return this;
	}

	public addDivider(y: number): PdfGenerator {
		this._doc
			.strokeColor("#aaaaaa")
			.lineWidth(1)
			.moveTo(50, y)
			.lineTo(550, y)
			.stroke();
		
		return this;
	}

	public addFooter(model: Model<Dictionary> | Dictionary): PdfGenerator {
		this._doc
			.fontSize(10)
			.text(
				"Gjeneruar automatikisht nga sistemi Catasta",
				50,
				780,
				{ align: "center", width: 500 }
			);
		
		return this;
	}

	public async generate(model: Model<Dictionary> | Dictionary, reportId: string, say: MessengerFunction): Promise<Operation> {
		const doc = this._doc;

		const fileStreamOperation = await this.prepareFileStream(model, reportId, say);
		if (!fileStreamOperation.status) return { status: "failure", message: "Failed to open file for writing!" };

		const fileStream = fileStreamOperation.message;
		try {
			this.addHeader(model, say)
				.addBody(model)
				.addFooter(model);

			doc.pipe(fileStream.stream);
			doc.end();

			return new Promise((resolve) => {
				fileStream.stream.on("finish", () => {
					resolve({ status: "success", message: fileStream.path });
				});
			});

		} catch (error) {
			console.error(error);
			fileStream.stream.destroy();
			doc.end();
			return { status: "failure", message: "" };
		}

	}

}

export { PdfGenerator };
