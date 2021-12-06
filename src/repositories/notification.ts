import { DeleteResult, EntityRepository, Repository } from "typeorm";
import { Notification } from '../entities/notification';

export interface INotificationRepo {
    findNotification(limit?: number, offset?: number): Promise<Notification[]>;
    findNotificationByUuid(uuid: string): Promise<Notification>;
    saveNotification(notification: Partial<Notification>): Promise<Notification>;
}

/*
 * As a layer that will hit database
 * */
@EntityRepository(Notification)
export class NotificationRepository extends Repository<Notification> {

    async findNotification(limit = 0, offset = 0) {
        return this.find({
            skip: offset,
            take: limit,
            order: {
                uuid: 'DESC'
            }
        });
    }

    async findNotificationByUuid(uuid: string) {
        return this.findOne(uuid);
    }

    async saveNotification(notification: Partial<Notification>) {
        return await this.save(notification);
    }
}
