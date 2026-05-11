const { PrismaClient } = require("@prisma/client");

let prisma;

const getDb = () => {
  if (!prisma) {
    prisma = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL,
      log: process.env.STAGE === "dev" ? ["error", "warn"] : ["error"],
    });
  }
  return prisma;
};

module.exports = { getDb };