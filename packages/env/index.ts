import * as dotenv from "dotenv";

dotenv.config();

export * from "./server";
export { env as clientEnv } from "./client";