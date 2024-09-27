import { MessengerFunction } from "../Messenger";

export default {

	FS_SEPARATOR: process.platform === "win32" ? "\\" : "/",

	rootOf: (appendix: string, say: MessengerFunction): string => {
		return say("Path", "ask", "rootPathOf", appendix);
	}
	
}