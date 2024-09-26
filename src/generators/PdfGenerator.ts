import PDFDocument from "pdfkit";
import IDocGenerator from "../backend/interfaces/IDocGenerator";
import { DocType } from "../backend/types/DocType";
import { Model } from "../core/Model";
import { MessengerFunction } from "../Messenger";
import { Dictionary } from "../types/Dictionary";
import { Operation } from "../types/Operation";
import ModelFolder from "../files/ModelFolder";
import File from "../files/File";

class PdfGenerator implements IDocGenerator {

	private _model: Model<Dictionary> | Dictionary;
	private _type: DocType;
	private _options: Dictionary;
	private _doc: PDFKit.PDFDocument;

	constructor(model: Model<Dictionary> | Dictionary, options: Dictionary) {
		this._model = model;
		this._type = "pdf";
		this._options = options;

		const docOptions = {
			size: "A4",
			margin: 50
		};
		this._doc = new PDFDocument(docOptions);
	}

	public get model(): Model<Dictionary> | Dictionary { return this._model }
	public set model(value: Model<Dictionary> | Dictionary) { this._model = value }
	public get type(): DocType { return this._type }
	public set type(value: DocType) { this._type = value }
	public get options(): Dictionary { return this._options }
	public set options(value: Dictionary) { this._options = value }
	public get doc(): PDFKit.PDFDocument { return this._doc }
	public set doc(value: PDFKit.PDFDocument) { this._doc = value }

	private prepareFileStream(model: Model<Dictionary> | Dictionary, say: MessengerFunction): Promise<Operation> {
		const ownDomain = say(this, "ask", "ownDomain");
		const ownBranch = say(this, "ask", "ownBranch");
		const folder = ModelFolder.fromInfo(model.role, ownDomain.name, ownBranch.data.name, model.id, say);
		const fileName = File.timestampedName("GEN_" + model.id);
		return folder.getGeneratedFile(fileName).openAsWriteStream();
	}

	public addHeader(): PdfGenerator {
		const options = this._options;
		const domain = options.domain;
		const branch = options.branch;
		const domainName = domain.name;

		this._doc
			.image("logo.png", 50, 45, { width: 50 })
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

	public addBody(): PdfGenerator {
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

	public addFooter(): PdfGenerator {
		this._doc
			.fontSize(10)
			.text(
				"Payment is due within 15 days. Thank you for your business.",
				50,
				780,
				{ align: "center", width: 500 }
			);
		
		return this;
	}

	public async generate(model: Model<Dictionary> | Dictionary, say: MessengerFunction): Promise<Operation> {
		const doc = this._doc;

		const fileStreamOperation = await this.prepareFileStream(model, say);
		if (!fileStreamOperation.status) return { status: "failure", message: "Failed to open file for writing!" };

		this.addHeader()
			.addBody()
			.addFooter();

		doc.end();
		doc.pipe(fileStreamOperation.message);

		return { status: "success", message: "TODO" };
	}

}

export { PdfGenerator };
