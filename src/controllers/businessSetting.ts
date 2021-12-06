import { Request, Response, Router } from 'express';
import { IBusinessSettingSettingService } from '../services/businessSetting';

export class BusinessSettingController {
    private readonly businessService: IBusinessSettingSettingService;

    private readonly router: Router;

    public constructor(businessService: IBusinessSettingSettingService) {
        this.router = Router();
        this.businessService = businessService;

        this.router.get('/', this.index.bind(this));
        this.router.get('/:uuid', this.detail.bind(this));
        this.router.post('/', this.createOrUpdate.bind(this));
        // this.router.put('/:uuid', this.update.bind(this));
        this.router.delete('/:uuid', this.deleteSetting.bind(this));
    }

    getRouter() {
        return this.router;
    }

    /**
     * GET /businesss/settings
     * Get Business List
     */
    public index(req: Request, res: Response, next: any) {
        const { limit, offset } = req.query;
        this.businessService
            .getAll(Number(limit), Number(offset))
            .then((businesss) => {
                res.status(200).send(businesss);
            })
            .catch((error) => {
                next(error);
            });
    }

    /**
     * GET /businesss/settings/:id
     * Get Business by ID
     */
    public detail(req: Request, res: Response, next: any) {
        const { uuid } = req.params;
        this.businessService
            .getByUuid(uuid)
            .then((business) => {
                res.status(200).send(business);
            })
            .catch((error) => {
                next(error);
            });
    }

    /**
     * POST /businesss
     * Register Business
     */
    public createOrUpdate(req: Request, res: Response, next: any) {
        const { body } = req;
        this.businessService
            .createOrUpdate(body)
            .then((business) => {
                res.status(201).send(business);
            })
            .catch((error) => {
                next(error);
            });
    }

    /**
     * PUT /businesss/settings/:id
     * Update Business by ID
     */
    // public update(req: Request, res: Response, next: any) {
    //     const { uuid } = req.params;
    //     const { body } = req;
    //     this.businessService
    //         .update(uuid, body)
    //         .then((business) => {
    //             res.status(200).send(business);
    //         })
    //         .catch((error) => {
    //             next(error);
    //         });
    // }

    /**
     * DELETE /businesss/settings/:id
     * Update Business by ID
     */
    public deleteSetting(req: Request, res: Response, next: any) {
        const { uuid } = req.params;
        this.businessService
          .deleteSetting(uuid)
          .then((business) => {
              res.status(200).send(business);
          })
          .catch((error) => {
              next(error);
          });
    }
}
