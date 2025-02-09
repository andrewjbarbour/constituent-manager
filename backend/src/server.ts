import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDatabase, Person } from "./database";
import { Op } from "sequelize";
import dayjs from "dayjs";

dotenv.config();

export const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

connectToDatabase();

// Get all people with optional date range filtering
app.get("/people", async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  let whereClause = {};

  if (startDate || endDate) {
    whereClause = {
      signupTime: {
        ...(startDate && { [Op.gte]: startDate }),
        ...(endDate && { [Op.lte]: endDate }),
      },
    };
  }

  const people = await Person.findAll({ where: whereClause });
  res.json(people);
});

// Add or update a person
app.post("/people", async (req: Request, res: Response) => {
  const { name, email, address, signupTime } = req.body;
  if (!name || !email || !address) {
    res.status(400).json({ error: "Name, email, and address are required" });
    return;
  }

  try {
    let person = await Person.findOne({ where: { email } });
    if (person) {
      // Preserve the original signupTime if updating an existing person
      person.name = name;
      person.address = address;
    } else {
      person = Person.build({
        name,
        email,
        address,
        signupTime: signupTime || dayjs().format("YYYY-MM-DD"),
      });
    }

    await person.save();
    res.status(person.isNewRecord ? 201 : 200).json(person);
  } catch (error) {
    res.status(500).json({ error: "Failed to add or update person" });
  }
});

// Delete a person
app.delete("/people/:email", async (req: Request, res: Response) => {
  const email = req.params.email;
  const person = await Person.findOne({ where: { email } });

  if (!person) {
    res.status(404).json({ error: "Person not found" });
    return;
  }

  await person.destroy();
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
