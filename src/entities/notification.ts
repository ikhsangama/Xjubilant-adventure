import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("notification")
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column({
    nullable: false
  })
  payment_uuid: string;

  @Column({
    nullable: false
  })
  business_setting_uuid: string;

  @Column({
    nullable: false,
    generated: false
  })
  is_sent: boolean;

  @Column()
  retry_count: number;

  @Column({
    type: "json"
  })
  payload: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
