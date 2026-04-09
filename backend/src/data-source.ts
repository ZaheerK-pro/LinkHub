import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { Click } from "./entities/Click.js";
import { Link } from "./entities/Link.js";
import { Tenant } from "./entities/Tenant.js";
import { User } from "./entities/User.js";

dotenv.config();
const isProduction = process.env.NODE_ENV === "production";

const databaseUrl = process.env.DATABASE_URL ?? "";
const isLocalPostgres = /localhost|127\.0\.0\.1/.test(databaseUrl);
const useSsl =
  process.env.DATABASE_SSL === "true" ||
  (isProduction && databaseUrl.length > 0 && !isLocalPostgres);

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: false,
  entities: [User, Tenant, Link, Click],
  migrations: [isProduction ? "dist/migrations/*.js" : "src/migrations/*.ts"],
  ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {})
});
