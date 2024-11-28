import { Model } from "../../core/Model";
import { Dictionary } from "../../types/Dictionary";
import { MessengerFunction } from "../../Messenger";
import ExObject from "../../shared/Object";
import Metadata from "../../core/types/Metadata";
import OwnershipInfo from "../types/OwnershipInfo";
import IdCreator from "../IdCreator";
import { ModelCore } from "../../core/Model";

type NotificationData = {
    type: number;
    title: string;
    content: Dictionary;
    isRead: boolean;
};

class Notification extends Model<NotificationData> {
    static ROLE = "notification";

    static emptyData(): NotificationData {
        return {
            type: 1,
            title: "",
            content: {},
            isRead: false
        };
    }

    public static create(say: MessengerFunction, data: NotificationData, ownership: OwnershipInfo, meta?: Metadata): Notification {
        if (ExObject.isDictEmpty(data)) data = Notification.emptyData();
        const repository = IdCreator.createBranchedRepoId("notifications", ownership.branch || "", ownership.domain);

        const now = Date.now();
        const creator = say(this, "ask", "ownUserId");
        if (!meta) meta = { timeCreated: now, timeUpdated: now, creator };

        const core: ModelCore<NotificationData> = { _id: "", repository, role: Notification.ROLE, data, meta };
        return new Notification(core);
    }
}

export { Notification };
export type { NotificationData };
