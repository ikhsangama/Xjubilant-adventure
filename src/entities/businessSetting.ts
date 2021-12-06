import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity('business_settings')
export class BusinessSetting {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({
        nullable: false
    })
    business_uuid: string;

    @Column()
    webhook_url: string;

    @Column()
    secret_key: string;
}
