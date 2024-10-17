import PDFDocument from "pdfkit";
import IDocGenerator from "../backend/interfaces/IDocGenerator";
import { DocType } from "../backend/types/DocType";
import { Model } from "../core/Model";
import { MessengerFunction } from "../Messenger";
import { Dictionary } from "../types/Dictionary";
import { Operation } from "../types/Operation";
import ModelFolder from "../files/ModelFolder";
import File from "../files/File";
import { DetailedFind } from "../backend/types/DetailedFind";

class PdfGenerator implements IDocGenerator {

	private _type: DocType;
	private _options: Dictionary;
	private _doc: PDFKit.PDFDocument;
	private _say: MessengerFunction;

	constructor(options: Dictionary, say: MessengerFunction) {
		this._type = "pdf";
		this._options = options;

		const docOptions = {
			size: "A4",
			margin: 50
		};
		this._doc = new PDFDocument(docOptions);
		this._say = say;
	}

	public get type(): DocType { return this._type }
	public set type(value: DocType) { this._type = value }
	public get options(): Dictionary { return this._options }
	public set options(value: Dictionary) { this._options = value }
	public get doc(): PDFKit.PDFDocument { return this._doc }
	public set doc(value: PDFKit.PDFDocument) { this._doc = value }
	public get say(): MessengerFunction { return this._say }
	public set say(value: MessengerFunction) { this._say = value }

	private async prepareFileStream(model: Model<Dictionary> | Dictionary, reportId: string, say: MessengerFunction): Promise<Operation> {
		const domain = this.options.domain;
		const branch = this.options.branch;
		const folder = ModelFolder.fromInfo(model.role, domain.name, branch.data.name, model.id, say);
		
		await folder.ensureReportsExist(say);

		const fileName = File.basicName(reportId + ".pdf");
		return folder.getReportFile(fileName).openAsWriteStream();
	}

	public addTitle(): PdfGenerator {
		const options = this._options;
		const domain = options.domain;

		const doc = this._doc;
		const title = "Order Summary";
		const subtitle = `For ${domain.name}`;
		const version = "By Catasta";

		// doc.font("fonts/AlegreyaSans-Light.ttf", 60);
		doc.fontSize(60);
		doc.y = doc.page.height / 2 - doc.currentLineHeight();
		doc.text(title, { align: "center" });
		const w = doc.widthOfString(title);
		// doc.h1Outline = doc.outline.addItem(title);

		doc.fontSize(20);
		doc.y -= 10;
		doc.text(subtitle, {
			align: "center",
			indent: w - doc.widthOfString(subtitle)
		});

		doc.fontSize(10);
		// doc.font(styles.para.font, 10);
		doc.text(version, {
			align: "center",
			indent: w - doc.widthOfString(version)
		});

		doc.addPage();
		return this;
	}

	public addHeader(detailedFind: DetailedFind<Model<Dictionary>> | Dictionary, say: MessengerFunction): PdfGenerator {
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

	public addBody(detailedFind: DetailedFind<Model<Dictionary>> | Dictionary): PdfGenerator {
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

	public addFooter(detailedFind: DetailedFind<Model<Dictionary>> | Dictionary): PdfGenerator {
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

	public async generate(detailedFind: DetailedFind<Model<Dictionary>> | Dictionary, reportId: string, say: MessengerFunction): Promise<Operation> {
		const doc = this._doc;
		const model = detailedFind.model;

		const fileStreamOperation = await this.prepareFileStream(model, reportId, say);
		if (!fileStreamOperation.status) return { status: "failure", message: "Failed to open file for writing!" };

		const fileStream = fileStreamOperation.message;
		try {
			
			doc.pipe(fileStream.stream);
			
			this
				.addTitle()
				.addHeader(detailedFind, say)
				.addBody(detailedFind)
				.addFooter(detailedFind);

			doc.end();
			
			return new Promise((resolve, reject) => {
				fileStream.stream.on("finish", () => {
					fileStream.stream.close();
					resolve({ status: "success", message: fileStream.path });
				});

				fileStream.stream.on("error", (e: Error) => {
					fileStream.stream.close();
					reject({ status: "failure", message: e.stack || e.message });
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
