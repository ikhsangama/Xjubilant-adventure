import { INotificationRepo } from "../repositories/notification";
import { Notification } from "../entities/notification";
import { IBusinessSettingRepo } from "src/repositories/businessSetting";
import axios from "axios";
import { generateSign } from "../utilities/gen-signature";

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
  private readonly businessRepository: IBusinessSettingRepo;

  public constructor(notificationRepository: INotificationRepo, businessSettingRepository: IBusinessSettingRepo) {
    this.notificationRepository = notificationRepository;
    this.businessRepository = businessSettingRepository;

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
    const { payment_uuid, business_setting_uuid, payload } = notification;
    const errors = [];
    if (!payment_uuid) errors.push("payment_uuid must be filled");
    if (!business_setting_uuid) errors.push("business_setting_uuid must be filled");
    if (!payload) errors.push("payload must be filled");
    // eslint-disable-next-line no-throw-literal
    if (errors.length > 0) throw { name: "Invalid Input", errors, status: 400 };

    const businessSetting = await this.businessRepository.findBusinessSettingByUuid(notification.business_setting_uuid);
    if (!businessSetting) throw { name: "Not Found", msg: "business setting not found", status: 404 };
    if (!businessSetting.secret_key) throw { name: "Not Found", msg: "Please generate your secret key", status: 404 };
    let notificationResponse = await this.notificationRepository.saveNotification({
      ...notification,
      is_sent: false,
      retry_count: notification.retry_count || 0
    });

    const signature_key = generateSign(notification.payload, businessSetting.secret_key);
    //asynchronous
    //can be optimized with broker RabbitMQ / Kafka
    axios({
      method: "POST",
      url: businessSetting.webhook_url,
      headers: {
        "impd-key": notificationResponse.payment_uuid,
        "token": signature_key
      },
      data: notificationResponse.payload
    });
    notificationResponse = {
      ...notificationResponse,
      is_sent: true
    };
    notificationResponse = await this.notificationRepository.saveNotification(notificationResponse);
    return notificationResponse;
  }
}
