import { DeleteResult, EntityRepository, Repository } from "typeorm";
import { BusinessSetting } from '../entities/businessSetting';

export interface IBusinessSettingRepo {
    findBusinessSetting(limit?: number, offset?: number): Promise<BusinessSetting[]>;
    findBusinessSettingByUuid(uuid: string): Promise<BusinessSetting>;
    createOrUpdateBusinessSetting(businessSetting: Partial<BusinessSetting>): Promise<BusinessSetting>;
    // updateBusinessSetting(uuid: string, businessSetting: Partial<BusinessSetting>): Promise<BusinessSetting>;
    deleteBusinessSetting(uuid: string): Promise<DeleteResult>;
}

/*
 * As a layer that will hit database
 * */
@EntityRepository(BusinessSetting)
export class BusinessSettingRepository extends Repository<BusinessSetting> {

    async findBusinessSetting(limit = 0, offset = 0) {
        return this.find({
            skip: offset,
            take: limit,
            order: {
                uuid: 'DESC'
            }
        });
    }

    async findBusinessSettingByUuid(uuid: string) {
        return this.findOne(uuid);
    }

    async createOrUpdateBusinessSetting(businessSetting: Partial<BusinessSetting>) {
        const businessRecord = await this.findOne({
            business_uuid: businessSetting.business_uuid
        })
        return await this.save({ ...businessRecord, ...businessSetting });

    }

    async deleteBusinessSetting(uuid: string) {
        return await this.delete(uuid);
    }
}
