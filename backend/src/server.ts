import express, { Request, Response } from "express";
import cors from "cors";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";

const app = express();
const port = 5001;

app.use(express.json());
app.use(cors());

interface Person {
  name: string;
  email: string;
  address: string;
  signupTime: string;
}

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

let people: Person[] = generateMockData(20);

// Get all people with optional date range filtering
app.get("/people", (req: Request, res: Response): void => {
  const { startDate, endDate } = req.query;
  let filteredPeople = people;

  if (startDate || endDate) {
    filteredPeople = people.filter((person) => {
      const signupDate = dayjs(person.signupTime);
      return (
        (!startDate ||
          signupDate.isAfter(dayjs(startDate as string).subtract(1, "day"))) &&
        (!endDate ||
          signupDate.isBefore(dayjs(endDate as string).add(1, "day")))
      );
    });
  }

  res.json(filteredPeople);
});

// Add or update a person
app.post("/people", (req: Request, res: Response): void => {
  const { name, email, address, signupTime } = req.body;
  if (!name || !email || !address || !signupTime) {
    res
      .status(400)
      .json({ error: "Name, email, address, and signupTime are required" });
    return;
  }

  const existingPersonIndex = people.findIndex((p) => p.email === email);
  if (existingPersonIndex !== -1) {
    // Update existing person
    people[existingPersonIndex] = { name, email, address, signupTime };
    res.status(200).json(people[existingPersonIndex]);
  } else {
    // Add new person
    const newPerson: Person = { name, email, address, signupTime };
    people.push(newPerson);
    res.status(201).json(newPerson);
  }
});

app.put("/people/:email", (req: Request, res: Response): void => {
  const email = req.params.email;
  const { name, address, signupTime } = req.body;

  const person = people.find((p) => p.email === email);
  if (!person) {
    res.status(404).json({ error: "Person not found" });
    return;
  }

  if (name) person.name = name;
  if (address) person.address = address;
  if (signupTime) person.signupTime = signupTime;

  res.json(person);
});

// Delete a person
app.delete("/people/:email", (req: Request, res: Response): void => {
  const email = req.params.email;
  const index = people.findIndex((person) => person.email === email);
  if (index === -1) {
    res.status(404).json({ error: "Person not found" });
    return;
  }

  people.splice(index, 1);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
