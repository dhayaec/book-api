import {MigrationInterface, QueryRunner} from "typeorm";

export class create1532675508000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `users` (`id` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `username` varchar(20) NOT NULL DEFAULT '', `mobile` varchar(15) NOT NULL, `password` text NOT NULL, `confirmed` tinyint NOT NULL DEFAULT 0, `forgotPasswordLocked` tinyint NOT NULL DEFAULT 0, `isBanned` tinyint NOT NULL DEFAULT 0, `createdDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `version` int NOT NULL, UNIQUE INDEX `IDX_97672ac88f789774dd47f7c8be` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `photo` (`id` varchar(255) NOT NULL, `name` varchar(100) NOT NULL, `description` text NOT NULL DEFAULT '', `filename` varchar(255) NOT NULL, `dominantColor` varchar(6) NOT NULL DEFAULT '', `views` double NOT NULL DEFAULT 0, `isPublished` tinyint NOT NULL DEFAULT 1, `isBanned` tinyint NOT NULL DEFAULT 0, `removed` tinyint NOT NULL DEFAULT 0, `userId` varchar(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `photo` ADD CONSTRAINT `FK_4494006ff358f754d07df5ccc87` FOREIGN KEY (`userId`) REFERENCES `users`(`id`)");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `photo` DROP FOREIGN KEY `FK_4494006ff358f754d07df5ccc87`");
        await queryRunner.query("DROP TABLE `photo`");
        await queryRunner.query("DROP INDEX `IDX_97672ac88f789774dd47f7c8be` ON `users`");
        await queryRunner.query("DROP TABLE `users`");
    }

}
