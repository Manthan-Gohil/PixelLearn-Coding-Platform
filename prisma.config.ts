import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { defineConfig } from "prisma/config";

const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
}
dotenv.config(); // fallback to default .env

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    seed: "tsx ./prisma/seed.ts",
  },
});
