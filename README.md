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

By default, runs on: http://localhost:3000


## Authentication

Registration and login return a JWT token.

The token is stored in localStorage and included in Authorization headers for protected routes.

CORS is configured to allow requests from the frontend (http://localhost:3000).



## Features

Register & Login

Create/update/delete projects

Add tasks per project

Toggle task completion

Form validation and error handling

Store and reuse JWT for authenticated requests

Loading indicators and user feedback

Filter and sort tasks

Mobile-friendly design


## Environment Variables

This project uses environment variables for configuration.

A template file is provided: `.env.example` for the backend and for the fronted.
To get started, copy it and rename to `.env`:



## Deployment
The deployed version of the project is available on the `deployment-version` branch.  
You can view the deployed frontend here:  
🔗 [https://mini-project-manager-livid.vercel.app](https://mini-project-manager-livid.vercel.app)

Please note that this deployment is provided for demonstration purposes only, and may occasionally be unavailable or limited.  
For a stable version of the code and to run the project locally, refer to the `main` branch.


https://github.com/user-attachments/assets/ba2174ba-6f79-4875-88a8-05337ec5d3f5



