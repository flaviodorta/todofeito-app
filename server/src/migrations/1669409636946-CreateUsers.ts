import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsers1669409636946 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },

          {
            name: 'name',
            type: 'varchar',
          },

          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },

          {
            name: 'password',
            type: 'varchar',
          },

          {
            name: 'photoURL',
            type: 'varchar',
            isNullable: true,
          },

          {
            name: 'language',
            type: 'varchar',
          },

          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable('users');
  }
}
