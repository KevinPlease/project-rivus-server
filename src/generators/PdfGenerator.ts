import PDFDocument from "pdfkit";
import IDocGenerator from "../backend/interfaces/IDocGenerator";
import { DocType } from "../backend/types/DocType";
import { Model } from "../core/Model";
import { MessengerFunction } from "../Messenger";
import { Dictionary } from "../types/Dictionary";
import { Operation } from "../types/Operation";
import ModelFolder from "../files/ModelFolder";
import File from "../files/File";

const invoice = {
	shipping: {
		name: "John Doe",
		address: "1234 Main Street",
		city: "San Francisco",
		state: "CA",
		country: "US",
		postal_code: 94111
	},
	items: [
		{
			item: "TC 100",
			description: "Toner Cartridge",
			quantity: 2,
			amount: 6000
		},
		{
			item: "USB_EXT",
			description: "USB Cable Extender",
			quantity: 1,
			amount: 2000
		}
	],
	subtotal: 8000,
	paid: 0,
	invoice_nr: 1234
};

class PdfGenerator implements IDocGenerator {

	public type: DocType;
	private _doc: PDFKit.PDFDocument;

	constructor() {
		this.type = "pdf";

		const options = {
			size: "A4",
			margin: 50
		};
		this._doc = new PDFDocument(options);
	}

	private prepareFileStream(model: Model<Dictionary> | Dictionary, say: MessengerFunction): Promise<Operation> {
		const ownDomain = say(this, "ask", "ownDomain");
		const ownBranch = say(this, "ask", "ownBranch");
		const folder = ModelFolder.fromInfo(model.role, ownDomain.name, ownBranch.data.name, model.id, say);
		const fileName = File.timestampedName("GEN_" + model.id);
		return folder.getGeneratedFile(fileName).openAsWriteStream();
	}

	private formatCurrency(cents) {
		return "$" + (cents / 100).toFixed(2);
	}

	private formatDate(date) {
		const day = date.getDate();
		const month = date.getMonth() + 1;
		const year = date.getFullYear();

		return year + "/" + month + "/" + day;
	}

	private addHeader(): PdfGenerator {
		this._doc
			.image("logo.png", 50, 45, { width: 50 })
			.fillColor("#444444")
			.fontSize(20)
			.text("ACME Inc.", 110, 57)
			.fontSize(10)
			.text("ACME Inc.", 200, 50, { align: "right" })
			.text("123 Main Street", 200, 65, { align: "right" })
			.text("New York, NY, 10025", 200, 80, { align: "right" })
			.moveDown();
		
		return this;
	}

	private addFooter(): PdfGenerator {
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

	private addCustomerInformation(invoice): PdfGenerator {
		this._doc
			.fillColor("#444444")
			.fontSize(20)
			.text("Invoice", 50, 160);

		this.addHr(185);

		const customerInformationTop = 200;

		this._doc
			.fontSize(10)
			.text("Invoice Number:", 50, customerInformationTop)
			.font("Helvetica-Bold")
			.text(invoice.invoice_nr, 150, customerInformationTop)
			.font("Helvetica")
			.text("Invoice Date:", 50, customerInformationTop + 15)
			.text(this.formatDate(new Date()), 150, customerInformationTop + 15)
			.text("Balance Due:", 50, customerInformationTop + 30)
			.text(
				this.formatCurrency(invoice.subtotal - invoice.paid),
				150,
				customerInformationTop + 30
			)

			.font("Helvetica-Bold")
			.text(invoice.shipping.name, 300, customerInformationTop)
			.font("Helvetica")
			.text(invoice.shipping.address, 300, customerInformationTop + 15)
			.text(
				invoice.shipping.city +
				", " +
				invoice.shipping.state +
				", " +
				invoice.shipping.country,
				300,
				customerInformationTop + 30
			)
			.moveDown();

		this.addHr(252);
		
		return this;
	}

	private addInvoiceTable(invoice): PdfGenerator {
		const doc = this._doc;
		let i: number;
		const invoiceTableTop = 330;

		doc.font("Helvetica-Bold");
		this.addTableRow(
			invoiceTableTop,
			"Item",
			"Description",
			"Unit Cost",
			"Quantity",
			"Line Total"
		);
		this.addHr(invoiceTableTop + 20);
		doc.font("Helvetica");

		for (i = 0; i < invoice.items.length; i++) {
			const item = invoice.items[i];
			const position = invoiceTableTop + (i + 1) * 30;
			this.addTableRow(
				position,
				item.item,
				item.description,
				this.formatCurrency(item.amount / item.quantity),
				item.quantity,
				this.formatCurrency(item.amount)
			);

			this.addHr(position + 20);
		}

		const subtotalPosition = invoiceTableTop + (i + 1) * 30;
		this.addTableRow(
			subtotalPosition,
			"",
			"",
			"Subtotal",
			"",
			this.formatCurrency(invoice.subtotal)
		);

		const paidToDatePosition = subtotalPosition + 20;
		this.addTableRow(
			paidToDatePosition,
			"",
			"",
			"Paid To Date",
			"",
			this.formatCurrency(invoice.paid)
		);

		const duePosition = paidToDatePosition + 25;
		doc.font("Helvetica-Bold");
		this.addTableRow(
			duePosition,
			"",
			"",
			"Balance Due",
			"",
			this.formatCurrency(invoice.subtotal - invoice.paid)
		);
		doc.font("Helvetica");
		
		return this;
	}

	private addTableRow(y, item, description, unitCost, quantity, lineTotal): PdfGenerator {
		this._doc
			.fontSize(10)
			.text(item, 50, y)
			.text(description, 150, y)
			.text(unitCost, 280, y, { width: 90, align: "right" })
			.text(quantity, 370, y, { width: 90, align: "right" })
			.text(lineTotal, 0, y, { align: "right" });
		
		return this;
	}

	private addHr(y): PdfGenerator {
		this._doc
			.strokeColor("#aaaaaa")
			.lineWidth(1)
			.moveTo(50, y)
			.lineTo(550, y)
			.stroke();
		
		return this;
	}

	public async generate(model: Model<Dictionary> | Dictionary, say: MessengerFunction): Promise<Operation> {
		const doc = this._doc;

		const fileStreamOperation = await this.prepareFileStream(model, say);
		if (!fileStreamOperation.status) return { status: "failure", message: "Failed to open file for writing!" };

		// TODO: GENERATION
		this.addHeader()
			.addCustomerInformation(invoice)
			.addInvoiceTable(invoice)
			.addFooter();

		doc.end();
		doc.pipe(fileStreamOperation.message);

		return { status: "success", message: "TODO" };
	}

}

export { PdfGenerator };
