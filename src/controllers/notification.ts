import { Request, Response, Router } from 'express';
import { INotificationService } from '../services/notification';
import axios from "axios";

export class NotificationController {
    private readonly notificationService: INotificationService;

    private readonly router: Router;

    public constructor(notificationService: INotificationService) {
        this.router = Router();
        this.notificationService = notificationService;

        this.router.get('/', this.index.bind(this));
        this.router.get('/:uuid', this.detail.bind(this));
        this.router.post('/', this.create.bind(this));
        this.router.post('/:uuid/retry', this.retry.bind(this));
    }

    getRouter() {
        return this.router;
    }

    /**
     * GET /notifications
     * Get Notification List
     */
    public async index(req: Request, res: Response, next: any) {
        const { limit, offset } = req.query;
        try{
            const notifications = await this.notificationService.getAll(Number(limit), Number(offset))
            res.status(200).send(notifications)
        }catch (error) {
            next(error);
        }
    }

    /**
     * GET /notifications/:id
     * Get Notification by ID
     */
    public async detail(req: Request, res: Response, next: any) {
        const { uuid } = req.params;
        try{
            const notification = await this.notificationService.getByUuid(uuid);
            res.status(200).send(notification);
        }catch (error) {
            next(error);
        }
    }

    /**
     * POST /notifications
     * Create Notification
     */
    public async create(req: Request, res: Response, next: any) {
        const { body } = req;
        try{
            const notification = await this.notificationService.create(body);
            res.status(201).send(notification);
        }catch (error) {
            next(error);
        }
    }

    /**
     * POST /notifications/:id/retry
     * Retry send notification
     */
    public async retry(req: Request, res: Response, next: any) {
        const { uuid } = req.params;
        try{
            let notification = await this.notificationService.getByUuid(uuid);
            if(!notification) throw {name: 'Not Found', msg: 'notification not found', status: 404};
            notification = await this.notificationService.create({
                ...notification,
                retry_count: notification.retry_count+1
            });
            res.status(201).send(notification);
        }catch (error) {
            next(error);
        }
    }
}
