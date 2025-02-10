import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Button } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { Person } from "../App.types";

interface ListToolbarProps {
  startDate: Dayjs | null;
  setStartDate: (date: Dayjs | null) => void;
  endDate: Dayjs | null;
  setEndDate: (date: Dayjs | null) => void;
  fetchPeople: (startDate?: Dayjs, endDate?: Dayjs) => void;
  exportToCSV: (people: Person[]) => void;
  people: Person[];
  setPeople: (people: Person[]) => void;
  handleFileUpload: (
    event: React.ChangeEvent<HTMLInputElement>,
    people: Person[],
    setPeople: (people: Person[]) => void
  ) => void;
}

function ListToolbar({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  fetchPeople,
  exportToCSV,
  people,
  setPeople,
  handleFileUpload,
}: ListToolbarProps) {
  const maxDate = dayjs().endOf("day");
  const minDate = maxDate.subtract(4, "day");

  return (
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
          onClick={() => exportToCSV(people)}
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
            onChange={(e) => handleFileUpload(e, people, setPeople)}
          />
        </Button>
        <DatePicker
          label="Signup start date"
          value={startDate}
          onChange={(newValue) => {
            setStartDate(newValue);
            fetchPeople(newValue ?? undefined, endDate ?? undefined);
          }}
          minDate={minDate}
          maxDate={maxDate}
        />
        <DatePicker
          label="Signup end date"
          value={endDate}
          onChange={(newValue) => {
            setEndDate(newValue);
            fetchPeople(startDate ?? undefined, newValue ?? undefined);
          }}
          minDate={minDate}
          maxDate={maxDate}
        />
      </LocalizationProvider>
    </div>
  );
}

export default ListToolbar;
