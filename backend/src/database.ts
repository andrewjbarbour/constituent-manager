import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";

const prisma = new PrismaClient();

export const connectToDatabase = async () => {
  try {
    await prisma.$connect();
    console.log("Connection has been established successfully.");
    await seedDatabase();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

const seedDatabase = async () => {
  const generateMockData = (num: number) => {
    const mockData = [];
    for (let i = 0; i < num; i++) {
      const name = faker.person.fullName();
      const signupTime = dayjs()
        .subtract(faker.number.int({ min: 0, max: 3 }), "day")
        .format("YYYY-MM-DD");
      mockData.push({
        name,
        email: faker.internet.email({
          firstName: name.split(" ")[0],
          lastName: name.split(" ")[1],
        }),
        address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state(
          { abbreviated: true }
        )}`,
        signupTime,
      });
    }
    return mockData;
  };

  const people = generateMockData(500);
  await prisma.person.createMany({ data: people });
  console.log("Database has been seeded.");
};
