import "dotenv/config";
import { prisma } from "./src/config/prisma";

async function main() {
  console.log("Connecting...");
  const count = await prisma.user.count();
  console.log("Connected! User count:", count);
}

main()
  .catch((e) => console.error("DB ERROR:", e))
  .finally(() => process.exit(0));
