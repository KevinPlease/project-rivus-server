import { Model } from "../../core/Model";
import { Dictionary } from "../../types/Dictionary";
import { MessengerFunction } from "../../Messenger";
import ExObject from "../../shared/Object";
import Metadata from "../../core/types/Metadata";
import OwnershipInfo from "../types/OwnershipInfo";
import IdCreator from "../IdCreator";
import { ModelCore } from "../../core/Model";
import { ENotificationAction } from "../types/ENotificationAction";

enum ENotificationPriority {
    bottom = -2,
    low = -1,
    normal = 0,
    high = 1,
    top = 2
}

enum ENotificationType {
    system = 1,
    user = 2
}

type NotificationData = {
    type: ENotificationType;
    content: Dictionary;
    isRead: boolean;
    priority: ENotificationPriority;
    action: ENotificationAction;
};

class Notification extends Model<NotificationData> {
    static ROLE = "notification";

    public static emptyData(): NotificationData {
        return {
            type: ENotificationType.system,
            content: {},
            isRead: false,
            priority: ENotificationPriority.normal,
            action: ENotificationAction.create
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

    public static forModel(say: MessengerFunction, model: Model<Dictionary>, action: ENotificationAction, priority: ENotificationPriority = ENotificationPriority.normal): Notification {
        const now = Date.now();
        const creator = say(this, "ask", "ownUserId");
        const meta = { timeCreated: now, timeUpdated: now, creator };

        const data = {
            type: ENotificationType.system,
            content: model,
            isRead: false,
            priority,
            action
        };

        return Notification.create(say, data, { domain: model.getDomainName(), branch: model.getBranchName() }, meta);
    }
}

export { Notification, ENotificationPriority, ENotificationType, ENotificationAction };
export type { NotificationData };
