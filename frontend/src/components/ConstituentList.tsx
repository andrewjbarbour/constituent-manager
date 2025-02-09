import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";

interface ConstituentListProps {
  people: Array<{
    name: string;
    email: string;
    address: string;
    signupTime: string;
  }>;
  startEdit: (person: {
    name: string;
    email: string;
    address: string;
    signupTime: string;
  }) => void;
  deletePerson: (email: string) => void;
}

function ConstituentList({
  people,
  startEdit,
  deletePerson,
}: ConstituentListProps) {
  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", width: 300 },
    { field: "address", headerName: "Address", width: 300 },
    { field: "signupTime", headerName: "Signup Time", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => startEdit(params.row)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => deletePerson(params.row.email)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ height: "45vh", width: "100%" }}>
      <DataGrid
        rows={people}
        columns={columns}
        getRowId={(row) => row.email}
        rowCount={people.length}
      />
    </Box>
  );
}

export default ConstituentList;
