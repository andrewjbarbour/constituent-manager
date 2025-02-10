# Constituent Manager

This repository contains the source code for the Constituent Manager App, which includes both frontend and backend components. The frontend is built with React, TypesScript and Material UI, while the backend is built with Node, Express.js, SQLite, and Prisma.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js (18.0 or higher)
- npm (10.4.0 or higher)

## Getting Started

Clone the project:

```sh
https://github.com/andrewjbarbour/constituent-manager.git
```

### Backend

Navigate to the backend directory, install the dependencies, and start the server:

```sh
cd backend
npm install
npm run dev
```

The backend server will start on http://localhost:5001

You can set a custom port for the back-end server by updating the .env files in both the backend and frontend directories (`PORT` in backend/.env and `VITE_API_PORT` in frontend/.env).

### Frontend

Open a new terminal and navigate to the frontend directory. Install the dependencies, set up the sqlite database with Prisma, and start the server:

```sh
cd backend
npm install
npx prisma migrate dev --name init
npm run dev
```

The frontend development server will start on http://localhost:5173.

### Seeding the database

By default, the SQLite database is initially seeded with 500 mock constituents. You can configure how many constituents are seeded with `generateMockData` in `database.ts`.

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

`POST /people`: Add or update a person.

`DELETE /people/:email`: Delete a person by email.
