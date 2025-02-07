import { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
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
  const [updatedPerson, setUpdatedPerson] = useState({
    name: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setPeople(data))
      .catch((error) => console.error("Error fetching people:", error));
  }, []);

  const addPerson = async () => {
    console.log("clicking add person");
    if (!name.trim() || !email.trim() || !address.trim()) return;
    try {
      console.log("sending request to add person");
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, address }),
      });
      if (!response.ok) throw new Error("Failed to add person");
      const newPerson = await response.json();
      console.log("newPerson", newPerson);
      setPeople((prevPeople) => [...prevPeople, newPerson]);
      setName("");
      setEmail("");
      setAddress("");
    } catch (error) {
      console.error("Error adding person:", error);
    }
  };

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
    setEditingPerson(person); // Set the person to be edited
    setUpdatedPerson({
      name: person.name,
      email: person.email,
      address: person.address,
    });
  };

  const updatePerson = async () => {
    if (!editingPerson) return;

    const response = await fetch(
      `http://localhost:5001/people/${editingPerson.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPerson),
      }
    );

    if (response.ok) {
      const updated = await response.json();
      setPeople((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setEditingPerson(null); // Clear the editing state
      setUpdatedPerson({ name: "", email: "", address: "" }); // Clear the form fields
    } else {
      alert("Failed to update person.");
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
          {/* <Typography variant="h6">
          {editingPerson ? `Editing ${editingPerson.name}` : "Add Contact"}
        </Typography> */}
          <TextField
            fullWidth
            label="Name"
            value={updatedPerson.name}
            onChange={(e) => {
              setName(e.target.value);
              setUpdatedPerson({ ...updatedPerson, name: e.target.value });
            }}
            sx={{ mb: 1 }}
          />
          <TextField
            fullWidth
            label="Email"
            value={updatedPerson.email}
            onChange={(e) => {
              setEmail(e.target.value);
              setUpdatedPerson({ ...updatedPerson, email: e.target.value });
            }}
            sx={{ mb: 1 }}
          />
          <TextField
            fullWidth
            label="Address"
            value={updatedPerson.address}
            onChange={(e) => {
              setAddress(e.target.value);
              setUpdatedPerson({ ...updatedPerson, address: e.target.value });
            }}
            sx={{ mb: 1 }}
          />
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={editingPerson ? updatePerson : addPerson} // Use updatePerson if editing, else addPerson
            >
              {editingPerson ? "Update" : "Add"} Contact
            </Button>
            {editingPerson && (
              <Button variant="outlined" onClick={() => setEditingPerson(null)}>
                Cancel
              </Button>
            )}
          </Box>
        </Card>

        {/* People List */}
        <List>
          {people.map((person) => (
            <ListItem key={person.id} sx={{ borderBottom: "1px solid #ddd" }}>
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
      </Container>
    </ThemeProvider>
  );
}

export default App;
