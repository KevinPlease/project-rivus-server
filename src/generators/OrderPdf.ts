import { Order } from "../backend/models/Order";
import { PdfGenerator } from "./PdfGenerator";

class OrderPdf extends PdfGenerator {

	public get model(): Order { return this.model }

	public formatCurrency(cents: number) {
		return "$" + (cents / 100).toFixed(2);
	}

	public formatDate(time: number) {
		const date = new Date(time);
		const day = date.getDate();
		const month = date.getMonth() + 1;
		const year = date.getFullYear();

		return year + "/" + month + "/" + day;
	}

	public addHeader(): OrderPdf {
		const options = this.options;
		const domain = options.domain;
		const branch = options.branch;
		const domainName = domain.name;

		this.doc
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

	public addCustomerInformation(): OrderPdf {
		this.doc
			.fillColor("#444444")
			.fontSize(20)
			.text("Fatura", 50, 160);

		this.addDivider(185);

		const model = this.model;
		const modelData = model.data;
		const customerInformationTop = 200;

		this.doc
			.fontSize(10)
			.text("Numri i Fatures:", 50, customerInformationTop)
			.font("Helvetica-Bold")
			.text(model.displayId, 150, customerInformationTop)
			.font("Helvetica")
			.text("Data e fatures:", 50, customerInformationTop + 15)
			.text(this.formatDate(model.meta.timeCreated), 150, customerInformationTop + 15)
			.text("Totali:", 50, customerInformationTop + 30)
			.text(
				this.formatCurrency(modelData.totalAmount),
				150,
				customerInformationTop + 15
			)
			.text("Menyra e Pageses:", 50, customerInformationTop + 15)
			.text(modelData.paymentMethod, 150, customerInformationTop + 30)

			.font("Helvetica-Bold")
			.text(modelData.customer, 300, customerInformationTop)
			.font("Helvetica")
			.text(modelData.customer, 300, customerInformationTop + 30)
			// .text(
			// 	invoice.shipping.city +
			// 	", " +
			// 	invoice.shipping.state +
			// 	", " +
			// 	invoice.shipping.country,
			// 	300,
			// 	customerInformationTop + 30
			// )
			.moveDown();

		this.addDivider(252);
		
		return this;
	}

	public addInvoiceTable(): OrderPdf {
		const doc = this.doc;
		const invoiceTableTop = 330;
		
		doc.font("Helvetica-Bold");
		this.addTableRow(
			invoiceTableTop,
			"Njesia",
			"Titulli",
			"Cmimi per m2",
			"Siperfaqja",
			"Vlera"
			);
			this.addDivider(invoiceTableTop + 20);
			doc.font("Helvetica");
			
		const model = this.model;
		let i: number;
		for (i = 0; i < model.data.units.length; i++) {
			const unit = model.data.units[i];
			const position = invoiceTableTop + (i + 1) * 30;
			this.addTableRow(
				position,
				unit.displayId || "N/A",
				unit.data.title,
				this.formatCurrency(unit.data.price),
				String(unit.data.grossArea),
				this.formatCurrency(unit.data.price * unit.data.grossArea)
			);

			this.addDivider(position + 20);
		}

		// const subtotalPosition = invoiceTableTop + (i + 1) * 30;
		// this.addTableRow(
		// 	subtotalPosition,
		// 	"",
		// 	"",
		// 	"Subtotal",
		// 	"",
		// 	this.formatCurrency(invoice.subtotal)
		// );

		// const paidToDatePosition = subtotalPosition + 20;
		// this.addTableRow(
		// 	paidToDatePosition,
		// 	"",
		// 	"",
		// 	"Paid To Date",
		// 	"",
		// 	this.formatCurrency(invoice.paid)
		// );

		const duePosition = invoiceTableTop + (i + 1) * 30;
		doc.font("Helvetica-Bold");
		this.addTableRow(
			duePosition,
			"",
			"",
			"TOTAL",
			"",
			this.formatCurrency(model.data.totalAmount)
		);
		doc.font("Helvetica");
		
		return this;
	}

	public addTableRow(y: number, id: string, title: string, price: string, area: string, unitTotal: string): OrderPdf {
		this.doc
			.fontSize(10)
			.text(id, 50, y)
			.text(title, 150, y)
			.text(price, 280, y, { width: 90, align: "right" })
			.text(area, 370, y, { width: 90, align: "right" })
			.text(unitTotal, 0, y, { align: "right" });
		
		return this;
	}

	public addBody(): OrderPdf {
		this.addCustomerInformation()
			.addInvoiceTable()
		
		return this;
	}

	public addFooter(): OrderPdf {
		this.doc
			.fontSize(10)
			.text(
				"Gjeneruar automatikisht nga sistemi Catasta",
				50,
				780,
				{ align: "center", width: 500 }
			);
		
		return this;
	}


}

export { OrderPdf };
