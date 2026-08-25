const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Clear existing demo data
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@audittrail.com",
      role: "ADMIN",
    },
  });

  const rahul = await prisma.user.create({
    data: {
      name: "Rahul Sharma",
      email: "rahul@audittrail.com",
      role: "USER",
    },
  });

  const priya = await prisma.user.create({
    data: {
      name: "Priyanshu raj",
      email: "priyanshu@audittrail.com",
      role: "USER",
    },
  });

  const priya = await prisma.user.create({
    data: {
      name: "Priya Patil",
      email: "priya@audittrail.com",
      role: "USER",
    },
  });

  // Create audit logs
  await prisma.auditLog.createMany({
    data: [
      {
        action: "CREATE",
        resource: "User",
        description: "Created new employee account",
        userId: admin.id,
      },
      {
        action: "LOGIN",
        resource: "Authentication",
        description: "Successful user login",
        userId: rahul.id,
      },
      {
        action: "UPDATE",
        resource: "Employee",
        description: "Updated employee department",
        userId: priya.id,
      },
      {
        action: "DELETE",
        resource: "Document",
        description: "Deleted confidential document",
        userId: admin.id,
      },
      {
        action: "LOGOUT",
        resource: "Authentication",
        description: "User logged out",
        userId: rahul.id,
      },
    ],
  });

  console.log("Demo data inserted successfully!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
