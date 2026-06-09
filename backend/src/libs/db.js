// src/libs/db.js
const { PrismaClient } = require("@prisma/client");

let prisma;

const getDb = () => {
  if (!prisma) {
    prisma = new PrismaClient({
      log: process.env.STAGE === "dev" ? ["error", "warn"] : ["error"],
    });
  }
  return prisma;
};

module.exports = { getDb };
