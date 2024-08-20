import crypto from "crypto";
import prisma from "../prismaClient";

async function main() {
  const tony = await prisma.user.upsert({
    where: { id: 0 },
    update: {},
    create: {
      name: "antoniobg",
      createdAt: new Date(),
      accessUuid: crypto.randomUUID(),
    },
  });

  console.log({ tony });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
