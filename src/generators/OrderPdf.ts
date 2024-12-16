import { Order } from "../backend/models/Order";
import { DetailedFind } from "../backend/types/DetailedFind";
import Folder from "../files/Folder";
import File from "../files/File";
import { MessengerFunction } from "../Messenger";
import { PdfGenerator } from "./PdfGenerator";
import ModelFolder from "../files/ModelFolder";
import { Unit } from "../backend/models/Unit";

class OrderPdf extends PdfGenerator {

	public formatCurrency(cents: number) {
		return "€" + (cents).toFixed(2);
	}

	public formatDate(time: number) {
		const date = new Date(time);
		const day = date.getDate();
		const month = date.getMonth() + 1;
		const year = date.getFullYear();

		return year + "/" + month + "/" + day;
	}

	public addHeader(detailedFind: DetailedFind<Order>, say: MessengerFunction): OrderPdf {
		const options = this.options;
		const domain = options.domain;
		const branch = options.branch;
		const domainName = domain.name;

		const iconPath = Folder.createPath(say, "shared", "icons", "Logo_01.png");

		this.doc
			.image(iconPath, 50, 45, { width: 50 })
			.fillColor("#444444")
			.fontSize(20)
			.text(domainName, 110, 57)
			.fontSize(10)
			.text(domainName, 200, 50, { align: "right" })
			.text(`Dega "${branch.data.name}"`, 200, 65, { align: "right" })
			.text(branch.data.address || "", 200, 80, { align: "right" })
			.moveDown();
		
		return this;
	}

	private addCustomerInformation(detailedFind: DetailedFind<Order>): OrderPdf {
		this.doc
			.fillColor("#444444")
			.fontSize(20)
			.text("Fatura", 50, 160);

		this.addDivider(185);

		const order = detailedFind.model;
		const formDetails = detailedFind.formDetails;
		const modelData = order.data;
		const customerInformationTop = 200;
		const customer = formDetails.customer.find(c => c._id.toString() === modelData.customer);
		const paymentMethod = formDetails.paymentMethod.find(p => p._id.toString() === modelData.paymentMethod);

		this.doc
			.fontSize(10)
			.text("Numri i Fatures:", 50, customerInformationTop)
			.font("Helvetica-Bold")
			.text(order.displayId, 150, customerInformationTop)
			.font("Helvetica")
			.text("Data e fatures:", 50, customerInformationTop + 15)
			.text(this.formatDate(order.meta.timeCreated), 150, customerInformationTop + 15)
			.text("Totali:", 50, customerInformationTop + 30)
			.text(
				this.formatCurrency(modelData.totalAmount),
				150,
				customerInformationTop + 30
				)
			.text("Menyra e Pageses:", 50, customerInformationTop + 45)
			.text(paymentMethod.data.name, 150, customerInformationTop + 45)
			
			.font("Helvetica-Bold")
			.text(customer.data.name, 300, customerInformationTop)
			.font("Helvetica")
			.text(customer.data.address, 300, customerInformationTop + 15)
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

		this.addDivider(270);
		
		return this;
	}

	private addInvoiceTable(detailedFind: DetailedFind<Order>): OrderPdf {
		const doc = this.doc;
		const invoiceTableTop = 330;
		const order = detailedFind.model;

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
			
		let i: number;
		for (i = 0; i < order.data.units.length; i++) {
			const unit = order.data.units[i];
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
			this.formatCurrency(order.data.totalAmount)
		);
		doc.font("Helvetica");
		
		return this;
	}

	private addTableRow(y: number, id: string, title: string, price: string, area: string, unitTotal: string): OrderPdf {
		this.doc
			.fontSize(10)
			.text(id, 50, y)
			.text(title, 150, y)
			.text(price, 280, y, { width: 90, align: "right" })
			.text(area, 370, y, { width: 90, align: "right" })
			.text(unitTotal, 0, y, { align: "right" });
		
		return this;
	}

	private addUnits(detailedFind: DetailedFind<Order>): OrderPdf {
		const doc = this.doc;
		const unitsStruct = doc.struct("Units");
		doc.addStructure(unitsStruct);
		
		const order = detailedFind.model;
		const formDetails = detailedFind.formDetails;

		const unitsStartY = 100;
		const imagesHeaderStartY = 170;
		const imagesStartY = 200;
		const imagesSpacing = 320;
		for (let i = 0; i < order.data.units.length; i++) {
			const unit = order.data.units[i];
			const unitData = unit.data;
			const property = formDetails.property.find(p => p._id.toString() === unitData.property);
			const unitType = formDetails.unitType.find(ut => ut._id.toString() === unitData.unitType);
			const owningFolder = ModelFolder.fromInfo(Unit.ROLE, this.options.domain.name, this.options.branch.data.name, unit._id || "", this.say);
			const path = owningFolder.getImagesPath(this.say);

			doc.addPage();

			unitsStruct.add(
				doc.struct("H1", {}, () => {
					doc
						.fontSize(18).font("Helvetica-Bold").text(`Unit ${unit.displayId} -- ${unitData.title}`);
				})
			);

			unitsStruct.add(
				doc.struct("B1", {}, () => {
					doc
						.fontSize(12)
						.font("Helvetica")
						.text("Tipi i Njesise: ", 50, unitsStartY)
						.text(unitType.data.name, 150, unitsStartY);
						
					doc
						.fontSize(12)
						.text("Prona: ", 50, unitsStartY + 15)
						.text(property.data.title, 150, unitsStartY + 15);
					
					doc
						.fontSize(12)
						.text("Siperfaqe: ", 50, unitsStartY + 30)
						.text(unitData.grossArea.toFixed(), 150, unitsStartY + 30);
				})
			);
			
			const images = unit.data.images || [];
			if (images.length === 0) continue;
			
			unitsStruct.add(
				doc.struct("H2", {}, () => {
					doc.font("Helvetica-Bold").fontSize(16).text("Imazhet", 50, imagesHeaderStartY);
				})
			);

			for (let y = 0; y < images.length; y++) {
				const curImage = images[y];
				const file = File.fromInfo(path, curImage.id);
				unitsStruct.add(
					doc.struct(
						`Image ${y + 1}`,
						{ alt: "Unit Image." },
						() => doc.image(file.getFullPath(), 150, imagesStartY + (y * imagesSpacing), { fit: [300, 300] })
					)
				)
			}
		}
		
		unitsStruct.end();

		return this;
	}

	public addBody(detailedFind: DetailedFind<Order> ): OrderPdf {
		this.addCustomerInformation(detailedFind)
			.addInvoiceTable(detailedFind)
			.addUnits(detailedFind);
		
		return this;
	}


}

export { OrderPdf };
