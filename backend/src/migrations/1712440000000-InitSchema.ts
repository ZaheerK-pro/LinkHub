import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1712440000000 implements MigrationInterface {
  name = "InitSchema1712440000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "tenant" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "theme" jsonb NOT NULL DEFAULT '{}',
        CONSTRAINT "UQ_tenant_name" UNIQUE ("name"),
        CONSTRAINT "PK_tenant_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "username" character varying NOT NULL,
        "tenant_id" uuid NOT NULL,
        CONSTRAINT "UQ_user_email" UNIQUE ("email"),
        CONSTRAINT "UQ_user_username" UNIQUE ("username"),
        CONSTRAINT "REL_user_tenant_id" UNIQUE ("tenant_id"),
        CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "link" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "tenant_id" uuid NOT NULL,
        "title" character varying NOT NULL,
        "url" character varying NOT NULL,
        "order_index" integer NOT NULL DEFAULT 0,
        CONSTRAINT "PK_link_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "click" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "link_id" uuid,
        CONSTRAINT "PK_click_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_user_tenant_id') THEN
          ALTER TABLE "user"
          ADD CONSTRAINT "FK_user_tenant_id"
          FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id")
          ON DELETE CASCADE ON UPDATE NO ACTION;
        END IF;
      END
      $$;
    `);
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_link_tenant_id') THEN
          ALTER TABLE "link"
          ADD CONSTRAINT "FK_link_tenant_id"
          FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id")
          ON DELETE CASCADE ON UPDATE NO ACTION;
        END IF;
      END
      $$;
    `);
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_click_link_id') THEN
          ALTER TABLE "click"
          ADD CONSTRAINT "FK_click_link_id"
          FOREIGN KEY ("link_id") REFERENCES "link"("id")
          ON DELETE CASCADE ON UPDATE NO ACTION;
        END IF;
      END
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "click" DROP CONSTRAINT "FK_click_link_id"`);
    await queryRunner.query(`ALTER TABLE "link" DROP CONSTRAINT "FK_link_tenant_id"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_user_tenant_id"`);
    await queryRunner.query(`DROP TABLE "click"`);
    await queryRunner.query(`DROP TABLE "link"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "tenant"`);
  }
}
