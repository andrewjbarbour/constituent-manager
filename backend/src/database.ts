import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";

// Define the attributes for the Person model
interface PersonAttributes {
  name: string;
  email: string;
  address: string;
  signupTime: string;
}

// Define the creation attributes for the Person model
interface PersonCreationAttributes
  extends Optional<PersonAttributes, "email"> {}

// Extend Sequelize's Model class
export class Person
  extends Model<PersonAttributes, PersonCreationAttributes>
  implements PersonAttributes
{
  public name!: string;
  public email!: string;
  public address!: string;
  public signupTime!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

Person.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    signupTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "People",
  }
);

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
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
  await Person.bulkCreate(people);
  console.log("Database has been seeded.");
};
