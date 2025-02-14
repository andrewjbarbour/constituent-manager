import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { connectToDatabase } from "./database";

const prisma = new PrismaClient();

dotenv.config();

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
    const existingPerson = await prisma.person.findUnique({ where: { email } });
    if (existingPerson) {
      // Update the existing person but keep the original signup time
      const person = await prisma.person.update({
        where: { email },
        data: {
          name,
          address,
          signupTime: existingPerson.signupTime,
        },
      });
      res.status(200).json(person);
    } else {
      // Create a new person
      const person = await prisma.person.create({
        data: {
          name,
          email,
          address,
          signupTime: signupTime || dayjs().format("YYYY-MM-DD"),
        },
      });
      res.status(201).json(person);
    }
  } catch (error) {
    console.error("Error adding person:", error);
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
      // Delete the person with the previous email
      await prisma.person.delete({ where: { email } });

      // Create a new person with the new email
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
      // Update the existing person
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
    console.error("Error updating person:", error);
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
    console.error("Error deleting person:", error);
    res.status(404).json({ error: "Person not found" });
  }
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
