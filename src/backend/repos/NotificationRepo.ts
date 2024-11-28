import { MessengerFunction } from "../../Messenger";
import MongoCollection from "../../mongo/MongoCollection";
import { Notification, NotificationData } from "../models/Notification";
import { BaseRepo } from "./BaseRepo";
import { IRepoOptions } from "../interfaces/IRepository";

class NotificationRepo extends BaseRepo<NotificationData> {
    public static REPO_NAME = "notifications";
    public static MODEL_ROLE_NAME = Notification.ROLE;

    public static create(collection: MongoCollection, domain: string) {
        const options: IRepoOptions = { needsDisplayIds: true };
        return new NotificationRepo(collection, this.REPO_NAME, this.MODEL_ROLE_NAME, domain, undefined, options);
    }

    public static getInstance(say: MessengerFunction): NotificationRepo {
        return super.getInstance(say) as NotificationRepo;
    }
}

export { NotificationRepo };
