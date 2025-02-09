import request from "supertest";
import { app } from "./server";
import { it, describe, expect } from "@jest/globals";

describe("GET /people", () => {
  it("should return all people", async () => {
    const response = await request(app).get("/people");
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should filter people by date range", async () => {
    const response = await request(app).get(
      "/people?startDate=2025-02-01&endDate=2025-02-09"
    );
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});

describe("POST /people", () => {
  it("should add a new person", async () => {
    const newPerson = {
      name: "John Doe",
      email: "john.doe@example.com",
      address: "123 Main St, Anytown, USA",
      signupTime: "2025-02-09",
    };
    const response = await request(app).post("/people").send(newPerson);
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(newPerson);
  });

  it("should return an error if any required field is missing", async () => {
    const newPerson = {
      name: "John Doe",
      email: "john.doe@example.com",
      address: "123 Main St, Anytown, USA",
    };
    const response = await request(app).post("/people").send(newPerson);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Name, email, address, and signupTime are required"
    );
  });

  it("should update an existing person if the email already exists", async () => {
    const existingPerson = {
      name: "Jane Doe",
      email: "jane.doe@example.com",
      address: "456 Elm St, Anytown, USA",
      signupTime: "2025-02-08",
    };
    await request(app).post("/people").send(existingPerson);

    const updatedPerson = {
      name: "Jane Smith",
      email: "jane.doe@example.com",
      address: "789 Oak St, Anytown, USA",
      signupTime: "2025-02-08",
    };
    const response = await request(app).post("/people").send(updatedPerson);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Jane Smith");
  });
});

describe("PUT /people/:email", () => {
  it("should update the details of an existing person", async () => {
    const existingPerson = {
      name: "John Smith",
      email: "john.smith@example.com",
      address: "123 Main St, Anytown, USA",
      signupTime: "2025-02-09",
    };
    await request(app).post("/people").send(existingPerson);

    const updatedPerson = {
      name: "John Doe",
      address: "456 Elm St, Anytown, USA",
      signupTime: "2025-02-10",
    };
    const response = await request(app)
      .put(`/people/${existingPerson.email}`)
      .send(updatedPerson);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("John Doe");
  });

  it("should return an error if the person is not found", async () => {
    const response = await request(app)
      .put("/people/nonexistent@example.com")
      .send({
        name: "Nonexistent Person",
        address: "123 Main St, Anytown, USA",
        signupTime: "2025-02-09",
      });
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Person not found");
  });
});

describe("DELETE /people/:email", () => {
  it("should delete an existing person", async () => {
    const existingPerson = {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      address: "123 Main St, Anytown, USA",
      signupTime: "2025-02-09",
    };
    await request(app).post("/people").send(existingPerson);

    const response = await request(app).delete(
      `/people/${existingPerson.email}`
    );
    expect(response.status).toBe(204);
  });

  it("should return an error if the person is not found", async () => {
    const response = await request(app).delete(
      "/people/nonexistent@example.com"
    );
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Person not found");
  });
});
