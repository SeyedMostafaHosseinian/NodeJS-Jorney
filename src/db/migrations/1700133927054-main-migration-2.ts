import { MigrationInterface, QueryRunner } from "typeorm";

export class MainMigration21700133927054 implements MigrationInterface {
    name = 'MainMigration21700133927054'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "displayId" character varying NOT NULL, "status" "public"."task_entity_status_enum" NOT NULL DEFAULT 'todo', "title" character varying NOT NULL, "description" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "assigneeId" uuid, "assigneeEmail" character varying, "assigneePhoneNumber" character varying, CONSTRAINT "PK_434d4d769de7549319f98db8985" PRIMARY KEY ("id", "displayId"))`);
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "age" integer NOT NULL, "job" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "passportId" uuid, CONSTRAINT "REL_8d5fc574376bbc8d6c1e2e8129" UNIQUE ("passportId"), CONSTRAINT "PK_f06ccee569af81fdf20768960f8" PRIMARY KEY ("id", "email", "phoneNumber"))`);
        await queryRunner.query(`CREATE TABLE "passport_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "country" character varying NOT NULL, "birthPlace" character varying NOT NULL, CONSTRAINT "PK_770c825e30d75b875d932cd75c6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "task_entity" ADD CONSTRAINT "FK_e4b94fd53735180a7b815653b26" FOREIGN KEY ("assigneeId", "assigneeEmail", "assigneePhoneNumber") REFERENCES "user_entity"("id","email","phoneNumber") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "FK_8d5fc574376bbc8d6c1e2e8129b" FOREIGN KEY ("passportId") REFERENCES "passport_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_8d5fc574376bbc8d6c1e2e8129b"`);
        await queryRunner.query(`ALTER TABLE "task_entity" DROP CONSTRAINT "FK_e4b94fd53735180a7b815653b26"`);
        await queryRunner.query(`DROP TABLE "passport_entity"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
        await queryRunner.query(`DROP TABLE "task_entity"`);
    }

}
