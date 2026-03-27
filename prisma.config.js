import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // For CLI tasks (migrate, pull, push), use the DIRECT URL (Port 5432)
    url: env("DIRECT_URL"), 
  },
});