import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createNotifications1638796194764 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
              name: 'notifications',
              columns: [
                  {
                      name: 'uuid',
                      type: 'uuid',
                      isPrimary: true,
                      generationStrategy: 'uuid',
                      isGenerated: true
                  },
                  {
                      name: 'business_uuid',
                      type: 'varchar',
                      isNullable: false,
                      isUnique: true
                  },
                  {
                      name: 'retry_count',
                      type: 'varchar'
                  },
                  {
                      name: 'payload',
                      type: 'json'
                  },
              ]
          }),
          true)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('notifications');
    }

}
