import { TextField, Button, Box, Card } from "@mui/material";
import { Person } from "../App.types";

interface ContactFormProps {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  address: string;
  setAddress: (address: string) => void;
  addOrUpdatePerson: () => void;
  cancelUpdate: () => void;
  editingPerson: Person | null;
}

function ContactForm({
  name,
  setName,
  email,
  setEmail,
  address,
  setAddress,
  addOrUpdatePerson,
  cancelUpdate,
  editingPerson,
}: ContactFormProps) {
  return (
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
        type="email"
      />
      <TextField
        fullWidth
        label="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        sx={{ mb: 1 }}
      />
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button variant="contained" color="primary" onClick={addOrUpdatePerson}>
          {editingPerson ? "Update" : "Add"} Contact
        </Button>
        {editingPerson && (
          <Button variant="outlined" onClick={cancelUpdate}>
            Cancel
          </Button>
        )}
      </Box>
    </Card>
  );
}

export default ContactForm;
