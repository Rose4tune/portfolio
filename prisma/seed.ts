import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("42ne", 10);
  await prisma.admin.upsert({
    where: { email: "rose" },
    update: {},
    create: {
      email: "rose",
      password,
    },
  });
  console.log("Admin user seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
