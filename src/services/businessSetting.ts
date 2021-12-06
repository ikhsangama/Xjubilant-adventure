import {IBusinessSettingRepo} from '../repositories/businessSetting';
import {BusinessSetting} from '../entities/businessSetting';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IBusinessSettingSettingService {
    getAll(limit: number, offset?: number): Promise<BusinessSetting[]>;
    getByUuid(uuid: string): Promise<BusinessSetting>;
    create(business: BusinessSetting): Promise<BusinessSetting>;
    update(uuid: string, business: Partial<BusinessSetting>): Promise<BusinessSetting>;
    // deleteSetting(uuid: string): Promise<BusinessSetting>;
}

export interface IBusinessSettingCreate {
    business_uuid: string;
    webhook_url: string;
    secret_key: string;
}

/*
 * Put some logic before request hit DB,
 * the purpose of service as between repository and controller layer,
 * as a gateway to filter/reduce unnecessary request and/or query that load to our Database
 * */
export class BusinessSettingService {
    private readonly businessRepository: IBusinessSettingRepo;

    public constructor(businessRepository: IBusinessSettingRepo) {
        this.businessRepository = businessRepository;
    }

    async getAll(limit = 0, offset = 0) {
        const business = await this.businessRepository.findBusinessSetting(limit, offset);
        business.sort((a, b) => Number(b.uuid) - Number(a.uuid));
        return business;
    }

    async getByUuid(uuid: string) {
        return this.businessRepository.findBusinessSettingByUuid(uuid);
    }

    /*
     * BusinessSetting must fill name at least 3 chars length
     * */
    async create(business: IBusinessSettingCreate) {
        return this.businessRepository.createBusinessSetting(business);
    }

    /*
     * BusinessSetting can't update name with empty value or less than 3 chars length
     * */
    async update(uuid: string, business: Partial<BusinessSetting>) {
        return this.businessRepository.updateBusinessSetting(uuid, business);
    }
}
