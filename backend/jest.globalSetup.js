const { execSync } = require("child_process");
const path = require("path");
const dotenv = require("dotenv");

module.exports = async () => {
  const envFilePath = path.resolve(__dirname, ".env.test");
  dotenv.config({ path: envFilePath });

  process.env.DATABASE_URL = process.env.DATABASE_URL_TEST;

  // Run Prisma migrations to set up the test database schema
  execSync("npx prisma migrate deploy", {
    stdio: "inherit",
  });
};
