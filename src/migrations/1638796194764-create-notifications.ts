import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createNotifications1638796194764 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "notification",
        columns: [
          {
            name: "uuid",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            isGenerated: true
          },
          {
            name: "payment_uuid",
            type: "uuid",
            isNullable: false
          },
          {
            name: "business_setting_uuid",
            type: "uuid",
            isNullable: false
          },
          {
            name: "is_sent",
            type: "boolean",
            isNullable: false,
            default: false
          },
          {
            name: "retry_count",
            type: "number"
          },
          {
            name: "payload",
            type: "object"
          },
          {
            name: "created_at",
            type: "timestamptz",
            default: "now()"
          },
          {
            name: "updated_at",
            type: "timestamptz",
            default: "now()"
          }
        ]
      }),
      true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("notification");
  }

}
