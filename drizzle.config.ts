import { env } from "@/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: ["./src/server/db/schema.ts", "./src/server/db/relations.ts"],
	out: "./drizzle",
	dialect: "postgresql",
	strict: true,
	verbose: true,
	dbCredentials: {
		url: env.DATABASE_URL,
	},
});
