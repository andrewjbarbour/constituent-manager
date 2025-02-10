import Papa from "papaparse";
import { Person } from "./App.types";
import { API_URL } from "./App.config";
import { z } from "zod";

export const exportToCSV = (people: Person[]) => {
  const csvContent = [
    ["Name", "Email", "Address", "Signup Time"],
    ...people.map((person) => [
      person.name,
      person.email,
      `"${person.address}"`,
      person.signupTime,
    ]),
  ]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "people_data.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const personSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.string().email("Invalid email").nonempty("Email is required"),
  address: z.string().nonempty("Address is required"),
  signupTime: z.string().nonempty("Signup Time is required"),
});

export const handleFileUpload = (
  event: React.ChangeEvent<HTMLInputElement>,
  people: Person[],
  setPeople: (people: Person[]) => void
) => {
  const file = event.target.files?.[0];
  if (file) {
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const newPeople: Person[] = results.data.map((row: any) => ({
          name: row.Name,
          email: row.Email,
          address: row.Address,
          signupTime: row["Signup Time"],
        }));

        const updatedPeople = [...people];

        for (const person of newPeople) {
          try {
            // Validate the data
            personSchema.parse(person);

            const existingPersonIndex = updatedPeople.findIndex(
              (p) => p.email === person.email
            );

            if (existingPersonIndex !== -1) {
              // Update the existing person
              const response = await fetch(`${API_URL}/${person.email}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(person),
              });
              if (!response.ok) throw new Error("Failed to update person");

              const updatedPerson = await response.json();
              updatedPeople[existingPersonIndex] = updatedPerson;
            } else {
              // Add the new person
              const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(person),
              });
              if (!response.ok) throw new Error("Failed to add person");

              const newPerson = await response.json();
              updatedPeople.push(newPerson);
            }
          } catch (error) {
            console.error("Error adding or updating person:", error);
          }
        }

        setPeople(updatedPeople);
      },
      error: (error) => {
        console.error("Error parsing CSV file:", error);
      },
    });
  }
};
