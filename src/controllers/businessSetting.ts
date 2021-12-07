import { Request, Response, Router } from "express";
import { IBusinessSettingSettingService } from "../services/businessSetting";
import { randString } from "../utilities/gen-key";

export class BusinessSettingController {
  private readonly businessService: IBusinessSettingSettingService;

  private readonly router: Router;

  public constructor(businessService: IBusinessSettingSettingService) {
    this.router = Router();
    this.businessService = businessService;

    this.router.get("/", this.index.bind(this));
    this.router.get("/:uuid", this.detail.bind(this));
    this.router.post("/:uuid/key", this.generateSecret.bind(this));
    this.router.post("/", this.createOrUpdate.bind(this));
    this.router.delete("/:uuid", this.deleteSetting.bind(this));
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
   * POST /businesss/settings/:id/key
   * Generate secret Key for each business
   */
  public async generateSecret(req: Request, res: Response, next: any) {
    const { uuid } = req.params;
    try {
      let business = await this.businessService.getByUuid(uuid);
      if (!business) throw { name: "Not Found", msg: "business setting not found", status: 404 };
      const secret_key = randString();
      console.log(business);
      business = await this.businessService.createOrUpdate({
        ...business,
        secret_key
      });
      res.status(200).send({ secret_key });
    } catch (error) {
      next(error);
    }
  }

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
