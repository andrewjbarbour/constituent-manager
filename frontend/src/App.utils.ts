import { Person } from "./App.types";

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
