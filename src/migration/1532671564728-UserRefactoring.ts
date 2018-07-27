import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserRefactoring1532671564728 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `users` ADD `isBanned` tinyint NOT NULL DEFAULT 0'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `isBanned`');
  }
}
