import { useEffect, useState } from "react";
import { Container, ThemeProvider } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import minMax from "dayjs/plugin/minMax";

import { Person } from "./App.types";
import { exportToCSV, handleFileUpload } from "./App.utils";
import { API_URL } from "./App.config";
import theme from "./theme";
import Header from "./components/Header";
import ContactForm from "./components/ContactForm";
import ListToolbar from "./components/ListToolbar";
import ConstituentList from "./components/ConstituentList";

import "./App.css";

dayjs.extend(minMax);

function App() {
  const [people, setPeople] = useState<Person[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    fetchPeople();
  }, []);

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

  const deletePerson = async (email: string) => {
    try {
      const response = await fetch(`${API_URL}/${email}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete person");
      fetchPeople(startDate ?? undefined, endDate ?? undefined);
    } catch (error) {
      console.error("Error deleting person:", error);
    }
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
      const method = editingPerson ? "PUT" : "POST";
      const url = editingPerson ? `${API_URL}/${editingPerson.email}` : API_URL;
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          address,
          signupTime: dayjs().format("YYYY-MM-DD"),
          newEmail: email,
        }),
      });
      if (!response.ok)
        throw new Error(`Failed to ${editingPerson ? "update" : "add"} person`);
      fetchPeople(startDate ?? undefined, endDate ?? undefined);
      setName("");
      setEmail("");
      setAddress("");
      setEditingPerson(null);
    } catch (error) {
      console.error(
        `Error ${editingPerson ? "updating" : "adding"} person:`,
        error
      );
    }
  };

  const cancelUpdate = () => {
    setName("");
    setEmail("");
    setAddress("");
    setEditingPerson(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0",
          maxWidth: "100vw",
        }}
      >
        <Header />
        <ContactForm
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          address={address}
          setAddress={setAddress}
          addOrUpdatePerson={addOrUpdatePerson}
          cancelUpdate={cancelUpdate}
          editingPerson={editingPerson}
        />
        <ListToolbar
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          fetchPeople={fetchPeople}
          exportToCSV={exportToCSV}
          people={people}
          setPeople={setPeople}
          handleFileUpload={handleFileUpload}
        />
        <ConstituentList
          people={people}
          startEdit={startEdit}
          deletePerson={deletePerson}
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;
