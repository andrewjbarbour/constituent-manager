import express, { Request, Response } from "express";
import cors from "cors";
import { faker } from "@faker-js/faker";

const app = express();
const port = 5001;

app.use(express.json());
app.use(cors());

interface Person {
  name: string;
  email: string;
  address: string;
}

const generateMockData = (num: number) => {
  const mockData = [];
  for (let i = 0; i < num; i++) {
    const name = faker.person.fullName();
    mockData.push({
      name,
      email: faker.internet.email({
        firstName: name.split(" ")[0],
        lastName: name.split(" ")[1],
      }),
      address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state(
        { abbreviated: true }
      )}`,
    });
  }
  return mockData;
};

let people: Person[] = [];

if (people.length === 0) {
  people = generateMockData(20);
}

// Get all people
app.get("/people", (req: Request, res: Response): void => {
  res.json(people);
});

// Add or update a person
app.post("/people", (req: Request, res: Response): void => {
  const { name, email, address } = req.body;
  if (!name || !email || !address) {
    res.status(400).json({ error: "Name, email, and address are required" });
    return;
  }

  const existingPersonIndex = people.findIndex((p) => p.email === email);
  if (existingPersonIndex !== -1) {
    // Update existing person
    people[existingPersonIndex] = { name, email, address };
    res.status(200).json(people[existingPersonIndex]);
  } else {
    // Add new person
    const newPerson: Person = { name, email, address };
    people.push(newPerson);
    res.status(201).json(newPerson);
  }
});

app.put("/people/:email", (req: Request, res: Response): void => {
  const email = req.params.email;
  const { name, address } = req.body;

  const person = people.find((p) => p.email === email);
  if (!person) {
    res.status(404).json({ error: "Person not found" });
    return;
  }

  if (name) person.name = name;
  if (address) person.address = address;

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

// Start the server
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
