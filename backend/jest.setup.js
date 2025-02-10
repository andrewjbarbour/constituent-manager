const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, ".env.test") });

const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL_TEST },
  },
});

module.exports = async () => {
  await prisma.$connect();
  await prisma.person.deleteMany();
  await prisma.$disconnect();
};
