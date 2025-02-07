import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#330072", // Custom blue similar to Indigov
    },
    secondary: {
      main: "#6C757D", // Light gray for accents
    },
    background: {
      default: "#f8f9fa", // Light background color
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
      color: "#2F72FF", // Custom blue for headers
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "1rem",
      color: "#333",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "2px", // Rounded buttons
          padding: "8px 20px",
          textTransform: "none", // Disable uppercase text
        },
      },
    },
  },
});

export default theme;
