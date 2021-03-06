import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("business_setting")
export class BusinessSetting {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column({
    nullable: false
  })
  business_uuid: string;

  @Column()
  webhook_url: string;

  @Column({
    nullable: true
  })
  secret_key: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
