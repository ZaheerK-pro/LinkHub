import { AppDataSource } from "./data-source.js";
import { buildApp } from "./app.js";

const port = Number(process.env.PORT || 4000);

async function bootstrap() {
  await AppDataSource.initialize();
  const app = buildApp();
  await app.listen({ port, host: "0.0.0.0" });
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
