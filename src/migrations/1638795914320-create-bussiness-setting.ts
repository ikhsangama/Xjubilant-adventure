import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createBussinessSetting1638795914320 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
              name: 'business_setting',
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
                      type: 'uuid',
                      isPrimary: true,
                      generationStrategy: 'uuid',
                      isGenerated: true
                  },
                  {
                      name: 'webhook_url',
                      type: 'varchar'
                  },
                  {
                      name: 'secret_key',
                      type: 'varchar'
                  },
                  {
                      name: 'created_at',
                      type: 'timestamptz',
                      default: 'now()'
                  },
                  {
                      name: 'updated_at',
                      type: 'timestamptz'
                  }
              ]
          }),
          true)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('business_setting');
    }

}
