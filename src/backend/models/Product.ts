import Metadata from "../../core/types/Metadata";
import { Model } from "../../core/Model";
import { MessengerFunction } from "../../Messenger";
import OwnershipInfo from "../types/OwnershipInfo";
import ExObject from "../../shared/Object";
import { ImageDetails } from "../types/ImageDetails";

type ProductData = {
	name: string;
	description: string;
	brand: string;
	category: string;
	price: number;
	quantity: number;
	availableQuantity: number;
	color: string;
	images: ImageDetails[];
	city: string;
	rating: number;
	tags: string[];
};

class Product extends Model<ProductData> {
	static ROLE = "product";

	static emptyData(): ProductData {
		return {
			name: "",
			description: "",
			brand: "",
			category: "",
			price: 0,
			availableQuantity: 0,
			quantity: 0,
			color: "",
			images: [],
			city: "",
			rating: 0,
			tags: [],
		};
	}

	public static create(say: MessengerFunction, data: ProductData, ownership: OwnershipInfo, meta?: Metadata): Product {
		if (ExObject.isDictEmpty(data)) data = Product.emptyData();

		const productRepo = say(this, "ask", "repo", "products");
		return Product._create(say, data, productRepo.repoName, "product", ownership, meta);
	}
}

export { Product };
export type { ProductData };
