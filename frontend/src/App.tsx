import { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Card,
  ThemeProvider,
} from "@mui/material";
import "./App.css";
import theme from "./theme";

const API_URL = "http://localhost:5001/people";

interface Person {
  id: number;
  name: string;
  email: string;
  address: string;
}

function App() {
  const [people, setPeople] = useState<Person[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setPeople(data))
      .catch((error) => console.error("Error fetching people:", error));
  }, []);

  const deletePerson = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete person");
      setPeople((prevPeople) =>
        prevPeople.filter((person) => person.id !== id)
      );
    } catch (error) {
      console.error("Error deleting person:", error);
    }
  };

  const exportToCSV = () => {
    if (people.length === 0) {
      alert("No data to export!");
      return;
    }

    const csvContent = [
      ["ID", "Name", "Email", "Address"], // CSV Header
      ...people.map((person) => [
        person.id,
        person.name,
        person.email,
        person.address,
      ]),
    ]
      .map((row) => row.join(",")) // Convert to CSV string
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

  const startEdit = (person: Person) => {
    setEditingPerson(person);
    setName(person.name);
    setEmail(person.email);
    setAddress(person.address);
  };

  const addOrUpdatePerson = async () => {
    if (!name.trim() || !email.trim() || !address.trim()) return;
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, address }),
      });
      if (!response.ok) throw new Error("Failed to add or update person");
      const updatedPerson = await response.json();
      setPeople((prevPeople) => {
        const existingPersonIndex = prevPeople.findIndex(
          (p) => p.email === email
        );
        if (existingPersonIndex !== -1) {
          // Update existing person
          const updatedPeople = [...prevPeople];
          updatedPeople[existingPersonIndex] = updatedPerson;
          return updatedPeople;
        } else {
          // Add new person
          return [...prevPeople, updatedPerson];
        }
      });
      setName("");
      setEmail("");
      setAddress("");
      setEditingPerson(null);
    } catch (error) {
      console.error("Error adding or updating person:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <div className="headerContainer">
          <Typography variant="h4" gutterBottom>
            Constituents
          </Typography>
          <Button
            variant="contained"
            onClick={exportToCSV}
            sx={{ mb: 2, ml: 5, backgroundColor: "#330072" }}
            className="exportButton"
          >
            Download CSV
          </Button>
        </div>

        {/* Edit Form (Only Visible When Editing) */}
        <Card sx={{ mb: 2, p: 2 }}>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 1 }}
          />
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 1 }}
          />
          <TextField
            fullWidth
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            sx={{ mb: 1 }}
          />
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={addOrUpdatePerson}
              disabled={!name || !email || !address}
            >
              {editingPerson ? "Update" : "Add"} Contact
            </Button>
            {editingPerson && (
              <Button
                variant="outlined"
                onClick={() => {
                  setName("");
                  setEmail("");
                  setAddress("");
                  setEditingPerson(null);
                }}
              >
                Cancel
              </Button>
            )}
          </Box>
        </Card>

        {/* People List */}
        <Box sx={{ maxHeight: 400, overflow: "auto" }}>
          <List>
            {people.map((person) => (
              <ListItem
                key={person.email}
                sx={{ borderBottom: "1px solid #ddd" }}
              >
                <ListItemText
                  primary={person.name}
                  secondary={`${person.email}, ${person.address}`}
                  color="text.secondary"
                />
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => startEdit(person)}
                >
                  Edit
                </Button>
              </ListItem>
            ))}
          </List>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
