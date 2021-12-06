import {EntityRepository, Repository} from 'typeorm';
import { BusinessSetting } from '../entities/businessSetting';

export interface IBusinessSettingRepo {
    findBusinessSetting(limit?: number, offset?: number): Promise<BusinessSetting[]>;
    findBusinessSettingByUuid(uuid: string): Promise<BusinessSetting>;
    createBusinessSetting(business: Partial<BusinessSetting>): Promise<BusinessSetting>;
    updateBusinessSetting(uuid: string, business: Partial<BusinessSetting>): Promise<BusinessSetting>;
    // deleteBusinessSetting(uuid: string): Promise<BusinessSetting>;
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

    async createBusinessSetting(business: Partial<BusinessSetting>) {
        return await this.save(business);
    }

    async updateBusinessSetting(uuid: string, updateData: Partial<BusinessSetting>) {
        const business = await this.findOneOrFail(uuid);
        return this.save({ ...business, ...updateData });
    }
}
