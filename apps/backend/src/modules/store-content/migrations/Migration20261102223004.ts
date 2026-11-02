import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261102223004 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "site_setting" drop constraint if exists "site_setting_key_unique";`);
    this.addSql(`create table if not exists "banner" ("id" text not null, "title" text not null, "subtitle" text null, "button_text" text null, "link" text null, "image_url" text null, "mobile_image_url" text null, "placement" text check ("placement" in ('hero', 'promo')) not null default 'hero', "rank" integer not null default 0, "is_active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "banner_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_banner_deleted_at" ON "banner" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "home_section" ("id" text not null, "title" text not null, "subtitle" text null, "type" text check ("type" in ('category_grid', 'product_grid')) not null default 'category_grid', "category_handle" text null, "collection_handle" text null, "max_items" integer not null default 8, "rank" integer not null default 0, "is_active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "home_section_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_home_section_deleted_at" ON "home_section" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "site_setting" ("id" text not null, "key" text not null, "value" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "site_setting_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_site_setting_key_unique" ON "site_setting" ("key") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_site_setting_deleted_at" ON "site_setting" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "banner" cascade;`);

    this.addSql(`drop table if exists "home_section" cascade;`);

    this.addSql(`drop table if exists "site_setting" cascade;`);
  }

}
