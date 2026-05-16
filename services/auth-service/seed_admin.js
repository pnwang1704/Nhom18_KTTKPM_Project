const bcrypt = require("bcrypt");
const repo = require("./src/repositories/user.repository");
const prisma = require("./src/config/db");

async function upsertAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL || "admin@example.com";
    const password = process.env.ADMIN_PASSWORD || "Admin@123";
    const fullName = process.env.ADMIN_FULLNAME || "Administrator";

    const existing = await repo.findByEmail(email);
    const passwordHash = await bcrypt.hash(password, 10);

    if (existing) {
      await repo.updateUser(existing.id, {
        role: "admin",
        passwordHash,
        fullName,
      });
      console.log("Updated existing user to admin:", email);
    } else {
      await repo.createUser({
        email,
        passwordHash,
        role: "admin",
        fullName,
        isVerified: true,
      });
      console.log("Created admin user:", email);
    }
  } catch (err) {
    console.error(
      "Failed to upsert admin user:",
      err && err.message ? err.message : err,
    );
    process.exit(2);
  } finally {
    try {
      await prisma.$disconnect();
    } catch (e) {}
  }
}

upsertAdmin().then(() => process.exit(0));
