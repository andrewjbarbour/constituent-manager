import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDatabase } from "./database";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

dotenv.config();

const prisma = new PrismaClient();
export const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

connectToDatabase();

// Get all people with optional date range filtering
app.get("/people", async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  let whereClause: any = {};

  if (startDate || endDate) {
    whereClause.signupTime = {
      ...(startDate && { gte: startDate }),
      ...(endDate && { lte: endDate }),
    };
  }

  const people = await prisma.person.findMany({ where: whereClause });
  res.json(people);
});

// Add a new person
app.post("/people", async (req: Request, res: Response) => {
  const { name, email, address, signupTime } = req.body;
  if (!name || !email || !address) {
    res.status(400).json({ error: "Name, email, and address are required" });
    return;
  }

  try {
    const person = await prisma.person.create({
      data: {
        name,
        email,
        address,
        signupTime: signupTime || dayjs().format("YYYY-MM-DD"),
      },
    });
    res.status(201).json(person);
  } catch (error) {
    res.status(500).json({ error: "Failed to add person" });
  }
});

// Update an existing person
app.put("/people/:email", async (req: Request, res: Response) => {
  const { name, address, newEmail } = req.body;
  const email = req.params.email;

  if (!name || !email || !address || !newEmail) {
    res
      .status(400)
      .json({ error: "Name, email, newEmail, and address are required" });
    return;
  }

  try {
    const existingPerson = await prisma.person.findUnique({ where: { email } });
    if (!existingPerson) {
      res.status(404).json({ error: "Person not found" });
      return;
    }

    if (email !== newEmail) {
      // If a person changes their email, delete the old entry and create a new one
      await prisma.person.delete({ where: { email } });

      const person = await prisma.person.create({
        data: {
          name,
          email: newEmail,
          address,
          signupTime: existingPerson.signupTime,
        },
      });
      res.status(200).json(person);
    } else {
      const person = await prisma.person.update({
        where: { email },
        data: {
          name,
          address,
          signupTime: existingPerson.signupTime,
        },
      });
      res.status(200).json(person);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update person" });
  }
});

// Delete a person
app.delete("/people/:email", async (req: Request, res: Response) => {
  const email = req.params.email;

  try {
    const person = await prisma.person.delete({ where: { email } });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: "Person not found" });
  }
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
