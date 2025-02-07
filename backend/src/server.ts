import express, { Request, Response } from "express";
import cors from "cors";
import { faker } from "@faker-js/faker";

const app = express();
const port = 5001;

app.use(express.json());
app.use(cors());

// In-memory storage
interface Person {
  id: number;
  name: string;
  email: string;
  address: string;
}

const generateMockData = (num: number) => {
  const mockData = [];
  for (let i = 0; i < num; i++) {
    mockData.push({
      id: i + 1,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state(
        { abbreviated: true }
      )}`,
    });
  }
  return mockData;
};

let people: Person[] = [];
let idCounter = 1;

if (people.length === 0) {
  people = generateMockData(20);
}

// Get all people
app.get("/people", (req: Request, res: Response): void => {
  res.json(people);
});

// Add a person
app.post("/people", (req: Request, res: Response): void => {
  const { name, email, address } = req.body;
  if (!name || !email || !address) {
    res.status(400).json({ error: "Name, email, and address are required" });
    return;
  }

  const newPerson: Person = { id: idCounter++, name, email, address };
  people.push(newPerson);
  res.status(201).json(newPerson);
});

app.put("/people/:id", (req: Request, res: Response): void => {
  const id = parseInt(req.params.id, 10);
  const { name, email, address } = req.body;

  const person = people.find((p) => p.id === id);
  if (!person) {
    res.status(404).json({ error: "Person not found" });
    return;
  }

  if (name) person.name = name;
  if (email) person.email = email;
  if (address) person.address = address;

  res.json(person);
});

// Delete a person
app.delete("/people/:id", (req: Request, res: Response): void => {
  const id = parseInt(req.params.id, 10);
  const index = people.findIndex((person) => person.id === id);
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
