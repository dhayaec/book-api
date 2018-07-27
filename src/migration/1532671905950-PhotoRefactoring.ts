import { MigrationInterface, QueryRunner } from 'typeorm';

export class PhotoRefactoring1532671905950 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `photo` ADD `isBanned` tinyint NOT NULL DEFAULT 0'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `photo` DROP COLUMN `isBanned`');
  }
}
