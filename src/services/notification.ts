import {INotificationRepo} from '../repositories/notification';
import {Notification} from '../entities/notification';
import { DeleteResult } from "typeorm";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface INotificationService {
    getAll(limit: number, offset?: number): Promise<Notification[]>;
    getByUuid(uuid: string): Promise<Notification>;
    create(notification: Partial<Notification>): Promise<Notification>;
}

export interface INotificationCreate {
    payment_uuid: string;
    business_setting_uuid: string;
    is_sent: boolean;
    retry_count: number;
    payload: string;
}

/*
 * Put some logic before request hit DB,
 * the purpose of service as between repository and controller layer,
 * as a gateway to filter/reduce unnecessary request and/or query that load to our Database
 * */
export class NotificationService {
    private readonly notificationRepository: INotificationRepo;

    public constructor(notificationRepository: INotificationRepo) {
        this.notificationRepository = notificationRepository;
    }

    async getAll(limit = 0, offset = 0) {
        const notification = await this.notificationRepository.findNotification(limit, offset);
        notification.sort((a, b) => Number(b.uuid) - Number(a.uuid));
        return notification;
    }

    async getByUuid(uuid: string) {
        return this.notificationRepository.findNotificationByUuid(uuid);
    }

    async create(notification: Partial<INotificationCreate>) {
        return this.notificationRepository.createNotification(notification);
    }
}
