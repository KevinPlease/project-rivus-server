import Url from "url";
import { MessengerFunction } from "../Messenger";
import { ExString } from "../shared/String";

const NetworkUrl = {

	fromPath: (reqPath: string): string => decodeURI(reqPath),
	
	fromParts: (protocol: string, subdomain: string, host: string, port: string): string => {
		let buffer = [protocol, "://"];

		if (subdomain) buffer.push(subdomain, ".");

		buffer.push(host);

		if (port) buffer.push(":", port);

		return buffer.join("");
	},

	parsed: (rawUrl: string): Url.UrlWithParsedQuery => {
		return Url.parse(rawUrl, true);
	},

	forImage: (domain: string, branch: string, modelRole: string, modelId: string, id: string, say: MessengerFunction) => {
		const hostUrl: string = say(NetworkUrl, "ask", "hostUrlForDomain", domain);
		return encodeURI(hostUrl + `/api/${ExString.uncapitalize(modelRole)}/image/${modelId}?imageId=${id}&branch=${branch}`);
	},

	forDocument: (domain: string, branch: string, modelRole: string, modelId: string, id: string, say: MessengerFunction) => {
		const hostUrl: string = say(NetworkUrl, "ask", "hostUrlForDomain", domain);
		return encodeURI(hostUrl + `/api/${ExString.uncapitalize(modelRole)}/document/${modelId}?documentId=${id}&branch=${branch}`);
	}

};

export default NetworkUrl;