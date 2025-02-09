import { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  ThemeProvider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import "./App.css";
import theme from "./theme";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import Papa from "papaparse";
import minMax from "dayjs/plugin/minMax";
dayjs.extend(minMax);

const API_URL = "http://localhost:5001/people";

interface Person {
  id: number;
  name: string;
  email: string;
  address: string;
  signupTime: string;
}

function App() {
  const [people, setPeople] = useState<Person[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const fetchPeople = (startDate?: Dayjs, endDate?: Dayjs) => {
    let url = API_URL;
    if (startDate || endDate) {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate.format("YYYY-MM-DD"));
      if (endDate) params.append("endDate", endDate.format("YYYY-MM-DD"));
      url += `?${params.toString()}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setPeople(data);
        if (data.length > 0) {
          const dates = data.map((person: Person) => dayjs(person.signupTime));
          setStartDate(dayjs.min(dates));
          setEndDate(dayjs.max(dates));
        }
      })
      .catch((error) => console.error("Error fetching people:", error));
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  const deletePerson = async (email: string) => {
    try {
      const response = await fetch(`${API_URL}/${email}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete person");
      fetchPeople(startDate ?? undefined, endDate ?? undefined);
    } catch (error) {
      console.error("Error deleting person:", error);
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ["ID", "Name", "Email", "Address", "Signup Time"], // CSV Header
      ...people.map((person) => [
        person.id,
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
        body: JSON.stringify({
          name,
          email,
          address,
          signupTime: dayjs().format("YYYY-MM-DD"),
        }),
      });
      if (!response.ok) throw new Error("Failed to add or update person");
      fetchPeople(startDate ?? undefined, endDate ?? undefined);
      setName("");
      setEmail("");
      setAddress("");
      setEditingPerson(null);
    } catch (error) {
      console.error("Error adding or updating person:", error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          const newPeople: Person[] = results.data.map((row: any) => ({
            id: row.ID,
            name: row.Name,
            email: row.Email,
            address: row.Address,
            signupTime: row["Signup Time"],
          }));

          const updatedPeople = [...people];

          for (const person of newPeople) {
            if (
              !person.name ||
              !person.email ||
              !person.address ||
              !person.signupTime
            ) {
              console.error("Missing required fields in CSV data:", person);
              continue;
            }

            try {
              const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(person),
              });
              if (!response.ok)
                throw new Error("Failed to add or update person");

              const updatedPerson = await response.json();
              const existingPersonIndex = updatedPeople.findIndex(
                (p) => p.email === person.email
              );
              if (existingPersonIndex !== -1) {
                updatedPeople[existingPersonIndex] = updatedPerson;
              } else {
                updatedPeople.push(updatedPerson);
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

  return (
    <ThemeProvider theme={theme}>
      <Container
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <div className="headerContainer">
          <Typography variant="h4" gutterBottom>
            Constituent Manager
          </Typography>
        </div>
        <Card sx={{ mb: 2, p: 2, maxWidth: 400 }}>
          <TextField
            fullWidth
            label="Full Name"
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
              // disabled={!name || !email || !address}
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            marginTop: "10px",
            marginBottom: "20px",
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Button
              variant="contained"
              onClick={exportToCSV}
              sx={{
                mb: 2,
                ml: 5,
                backgroundColor: "#330072",
                height: 50,
                margin: 0,
              }}
              className="exportButton"
            >
              Download
            </Button>
            <Button
              variant="outlined"
              component="label"
              sx={{
                mb: 2,
                ml: 5,
                height: 50,
                margin: 0,
              }}
              className="uploadButton"
            >
              Upload
              <input
                type="file"
                accept=".csv"
                hidden
                onChange={handleFileUpload}
              />
            </Button>
            <DatePicker
              label="Start date"
              value={startDate}
              onChange={(newValue) => {
                setStartDate(newValue);
                fetchPeople(newValue ?? undefined, endDate ?? undefined);
              }}
            />
            <DatePicker
              label="End date"
              value={endDate}
              onChange={(newValue) => {
                setEndDate(newValue);
                fetchPeople(startDate ?? undefined, newValue ?? undefined);
              }}
            />
          </LocalizationProvider>
        </div>
        <Box sx={{ maxHeight: "40vh", overflow: "auto", width: "100%" }}>
          <TableContainer component={Paper} sx={{ maxHeight: "40vh" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Signup Time</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {people.map((person) => (
                  <TableRow key={person.email}>
                    <TableCell>{person.name}</TableCell>
                    <TableCell>{person.email}</TableCell>
                    <TableCell>{person.address}</TableCell>
                    <TableCell>{person.signupTime}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => startEdit(person)}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => deletePerson(person.email)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
