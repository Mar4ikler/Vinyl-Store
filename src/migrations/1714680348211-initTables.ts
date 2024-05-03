import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTables1714680348211 implements MigrationInterface {
    name = 'InitTables1714680348211'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "vinyls" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "authorName" character varying NOT NULL, "price" integer NOT NULL, "image" character varying, CONSTRAINT "PK_309b6afad2f0f00e32f99a9bf79" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reviews" ("id" SERIAL NOT NULL, "comment" character varying NOT NULL, "score" integer NOT NULL, "authorId" integer NOT NULL, "vinylId" integer NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'USER')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying, "birthdate" TIMESTAMP, "avatar" character varying, "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."purchases_status_enum" AS ENUM('CREATED', 'PROCESSING', 'FAILED', 'SUCCEEDED')`);
        await queryRunner.query(`CREATE TABLE "purchases" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "vinylId" integer NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "paymentId" character varying NOT NULL, "totalPrice" integer NOT NULL, "paymentDate" TIMESTAMP, "status" "public"."purchases_status_enum" NOT NULL DEFAULT 'CREATED', CONSTRAINT "PK_1d55032f37a34c6eceacbbca6b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_35280601a9e3f54cb4b1e483bf" ON "purchases" ("paymentId") `);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_48770372f891b9998360e4434f3" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_824ac8e8ce880d78453bbdca9cb" FOREIGN KEY ("vinylId") REFERENCES "vinyls"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD CONSTRAINT "FK_341f0dbe584866284359f30f3da" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD CONSTRAINT "FK_3c3fed3f6ee4ece5639d75040bf" FOREIGN KEY ("vinylId") REFERENCES "vinyls"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "FK_3c3fed3f6ee4ece5639d75040bf"`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "FK_341f0dbe584866284359f30f3da"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_824ac8e8ce880d78453bbdca9cb"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_48770372f891b9998360e4434f3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_35280601a9e3f54cb4b1e483bf"`);
        await queryRunner.query(`DROP TABLE "purchases"`);
        await queryRunner.query(`DROP TYPE "public"."purchases_status_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "reviews"`);
        await queryRunner.query(`DROP TABLE "vinyls"`);
    }

}
