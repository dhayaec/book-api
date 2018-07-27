import { MigrationInterface, QueryRunner } from 'typeorm';

export class PhotoAddDeleted1532675670819 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE `photo` CHANGE `removed` `deleted` tinyint NOT NULL DEFAULT '0'"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE `photo` CHANGE `deleted` `removed` tinyint NOT NULL DEFAULT '0'"
    );
  }
}
