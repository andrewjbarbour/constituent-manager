import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";
import "@testing-library/jest-dom";

describe("App Component", () => {
  it("renders the form fields and buttons", () => {
    render(<App />);

    // Check if form fields are rendered
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();

    // Check if buttons are rendered
    expect(screen.getByText(/Add Contact/i)).toBeInTheDocument();
    expect(screen.getByText(/Download/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload/i)).toBeInTheDocument();
  });

  it("allows input in form fields", () => {
    render(<App />);

    // Simulate user input
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Address/i), {
      target: { value: "123 Main St" },
    });

    // Check if input values are updated
    expect(screen.getByLabelText(/Full Name/i)).toHaveValue("John Doe");
    expect(screen.getByLabelText(/Email/i)).toHaveValue("john.doe@example.com");
    expect(screen.getByLabelText(/Address/i)).toHaveValue("123 Main St");
  });

  it("adds a new contact when the Add Contact button is clicked", async () => {
    render(<App />);

    // Simulate user input
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Address/i), {
      target: { value: "123 Main St" },
    });

    // Click the Add Contact button
    fireEvent.click(screen.getByText(/Add Contact/i));

    // Check if the contact is added to the list
    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/john.doe@example.com/i)).toBeInTheDocument();
      expect(screen.getByText(/123 Main St/i)).toBeInTheDocument();
    });
  });
});
