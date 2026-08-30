const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const pg = require("pg");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Set all current users as admin for dev convenience, or specific user
  const u = await prisma.user.updateMany({
    where: {
      email: {
        in: ["manthan.gohil06@gmail.com", "manthangohil58@gmail.com", "tanuragshrivastava4@gmail.com"],
      },
    },
    data: { isAdmin: true },
  });
  console.log("Updated admin users:", u.count);

  const allUsers = await prisma.user.findMany({ select: { email: true, isAdmin: true } });
  console.log("Current user admin statuses:", allUsers);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
