# Constituent Manager

This repository contains the source code for the Constituent Manager App, an app for managing constituent contact details with both frontend and backend components. The frontend is built with React, TypesScript and Material UI, while the backend is built with Node, Express.js, SQLite, and Prisma.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js (18.0 or higher)
- npm (10.4.0 or higher)

## Getting Started

Clone the project:

```sh
git clone https://github.com/andrewjbarbour/constituent-manager.git
```

### Backend Setup

Navigate to the backend directory, run `npm run setup` (which will install the dependencies and setup the SQLite database with Prisma), and start the server:

```sh
cd backend
npm run setup
npm run dev
```

The backend server will start on http://localhost:5001

You can set a custom port for the back-end server by updating the .env files in both the backend and frontend directories (`PORT` in backend/.env and `VITE_API_PORT` in frontend/.env).

### Frontend Setup

Open a new terminal and navigate to the frontend directory. Install the dependencies and start the server:

```sh
cd frontend
npm install
npm run dev
```

The frontend development server will start on http://localhost:5173.

### Seeding the database

By default, the SQLite database is initially seeded with 500 mock constituents. You can configure how many constituents are seeded with `generateMockData` in `database.ts`.

### Testing

To run the tests, navigate to the backend directory and use the following command:

```sh
npm run test
```

This command will set up the test environment, apply the necessary Prisma migrations to the test database, and run the tests using Jest.

### Usage

Once both the frontend and backend servers are running, you can access the application by navigating to http://localhost:5173 in your web browser.

### Features

- View, sort, and filter a list of constituents with their details.
- Add a new constituent.
- Edit an existing constituent.
- Delete a constituent.
- Filter constituents by signup date range.
- Export the list of constituents to a CSV file filtered by signup range.
- Import a list of constituents from a CSV file.

### API Endpoints

The backend server provides the following API endpoints:

`GET /people`: Retrieve a list of people with optional date range filtering.

`POST /people`: Add a person.

`PUT /people/:email`: Update a person by email.

`DELETE /people/:email`: Delete a person by email.
