# Mini Project Manager

Full-stack application for managing projects and tasks, featuring:

- User authentication (JWT)
- Project and task management per user
- Persistent storage using SQLite
- Frontend built with React (via Vite)
- ASP.NET Core Web API backend

---

## Tech Stack

### Frontend
- **React** – Modern UI library for component-based development
- **TypeScript** – Type safety and developer productivity
- **Vite** – Fast build tool and dev server for React (alternative to CRA)

> **Why Vite?**  
> We used Vite as the development tool for React because it's significantly faster than Create React App (CRA) and simplifies configuration.  
> **Vite doesn't replace React** – it just makes React development faster and smoother.

### Backend
- **ASP.NET Core (C#)** – RESTful Web API
- **Entity Framework Core** – ORM for database access
- **JWT Authentication** – Secure token-based authentication
- **SQLite** – Lightweight embedded database

---

## Setup Instructions

### Backend
-cd backend
-dotnet restore
-dotnet run

By default, runs on: http://localhost:5000

**Note:** Default JWT secret is hardcoded for demo purposes. In production, store it securely (e.g., via environment variables).



### Fronted
-cd frontend
-npm install
-npm run dev

By default, runs on: http://localhost:3001


## Authentication

Registration and login return a JWT token.

The token is stored in localStorage and included in Authorization headers for protected routes.

CORS is configured to allow requests from the frontend (http://localhost:3001).



## Features

 Register & Login

 Create/update/delete projects

 Add tasks per project



 <img width="1906" height="727" alt="image" src="https://github.com/user-attachments/assets/2f08dc7d-6fc8-4fc4-8f62-19b61d912c6b" />
 <img width="1906" height="727" alt="image" src="https://github.com/user-attachments/assets/d512e418-ee8f-47fa-b07e-8ed83257ab21" />




