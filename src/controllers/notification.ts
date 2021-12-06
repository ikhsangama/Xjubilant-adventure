import { Request, Response, Router } from 'express';
import { INotificationService } from '../services/notification';

export class NotificationController {
    private readonly notificationService: INotificationService;

    private readonly router: Router;

    public constructor(notificationService: INotificationService) {
        this.router = Router();
        this.notificationService = notificationService;

        this.router.get('/', this.index.bind(this));
        this.router.get('/:uuid', this.detail.bind(this));
        this.router.post('/', this.create.bind(this));
    }

    getRouter() {
        return this.router;
    }

    /**
     * GET /notifications
     * Get Business List
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
     * Get Business by ID
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
     * Register Business
     */
    public async create(req: Request, res: Response, next: any) {
        const { payment_uuid, business_setting_uuid, payload } = req.body;
        try{
            const errors = [];
            if (!payment_uuid) errors.push('payment_uuid must be filled');
            if (!business_setting_uuid) errors.push('business_setting_uuid must be filled');
            if (!payload) errors.push('payload must be filled');
            // eslint-disable-next-line no-throw-literal
            if (errors.length > 0) throw { name: 'Invalid Input', errors, status: 400 };
            const notification = await this.notificationService.create({
                payment_uuid,
                business_setting_uuid,
                is_sent: false,
                retry_count: 0,
                payload,
            })
            res.status(201).send(notification);
        }catch (error) {
            next(error);
        }
    }
}
