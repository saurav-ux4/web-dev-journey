# MERN Todo App — Project README

You are building a classic MERN stack Todo App.

Tech Stack:
- Frontend → React
- Backend → Node.js + Express
- Database → MongoDB
- Communication → REST API using HTTP requests

---

# Main Features

- Add task
- Show all tasks
- Mark task as completed using checkbox
- Delete task
- Update task
- Store tasks in MongoDB
- Real-time UI updates after backend response

---

# Project Goal

Learn:
1. Frontend ↔ Backend connection
2. Backend ↔ Database connection
3. CRUD operations
4. REST API basics
5. Full MERN architecture
6. Real-world project structure

---

# How MERN Flow Works

User writes task in frontend  
↓  
React sends request to backend  
↓  
Express receives request  
↓  
Backend stores data in MongoDB  
↓  
MongoDB saves todo  
↓  
Backend sends response  
↓  
Frontend updates UI

---

# Final Project Structure

```txt
todo-app/
│
├── frontend/
│
├── backend/
│
└── README.md
```

---

# Frontend Structure

```txt
frontend/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   ├── TodoForm.jsx
│   │   ├── TodoItem.jsx
│   │   └── TodoList.jsx
│   │
│   ├── pages/
│   │   └── Home.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
└── vite.config.js
```

---

# Frontend Folder Explanation

## components/
Reusable UI pieces.

### TodoForm.jsx
Handles:
- Input field
- Add button
- Sending todo to backend

### TodoItem.jsx
Handles:
- Checkbox
- Delete button
- Single todo display

### TodoList.jsx
Loops through all todos.

---

## pages/
Contains website pages.

### Home.jsx
Main page of application.

---

## services/
Contains API requests.

### api.js
Frontend communicates with backend here.

Example:
```js
fetch("http://localhost:5000/todos")
```

---

## App.jsx
Main root component.

---

## main.jsx
Entry point of React app.

---

# Backend Structure

```txt
backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   └── todoController.js
│
├── models/
│   └── Todo.js
│
├── routes/
│   └── todoRoutes.js
│
├── server.js
├── package.json
└── .env
```

---

# Backend Folder Explanation

## config/db.js
Connects backend to MongoDB.

---

## models/Todo.js
Defines todo schema.

Example:
```js
{
  text: String,
  completed: Boolean
}
```

---

## controllers/todoController.js
Contains backend logic:
- Create todo
- Get todos
- Update todo
- Delete todo

---

## routes/todoRoutes.js
Defines API routes.

Example:
```txt
GET    /todos
POST   /todos
PUT    /todos/:id
DELETE /todos/:id
```

---

## server.js
Main backend file.

Responsibilities:
- Start server
- Use middleware
- Connect routes
- Connect database

---

# Database Structure (MongoDB)

```txt
Database
   ↓
Collections
   ↓
Documents
```

Our structure:

```txt
todoDB
   └── todos
          └── {
                _id,
                text,
                completed
              }
```

---

# Example Todo Document

```json
{
  "_id": "682f123abc",
  "text": "Learn MERN stack",
  "completed": false
}
```

---

# API Endpoints

## Get Todos

```http
GET /todos
```

---

## Add Todo

```http
POST /todos
```

Body:
```json
{
  "text": "Learn Backend"
}
```

---

## Update Todo

```http
PUT /todos/:id
```

---

## Delete Todo

```http
DELETE /todos/:id
```

---

# Recommended Packages

## Backend

```bash
npm install express mongoose cors dotenv nodemon
```

Purpose:
- express → backend framework
- mongoose → MongoDB
- cors → frontend/backend communication
- dotenv → environment variables
- nodemon → auto restart

---

## Frontend

```bash
npm install axios
```

Purpose:
- axios → API requests

---

# Environment Variables

Create `.env` inside backend:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

---

# DEVELOPMENT ROADMAP (VERY IMPORTANT)

# Phase 1 — Project Setup

Goal:
Create frontend and backend folders.

Tasks:
- Create project folder
- Setup React using Vite
- Setup Express backend
- Install dependencies
- Run frontend and backend servers



---

# Phase 2 — Backend Basics

Goal:
Create working backend server.

Tasks:
- Create Express server
- Use middleware
- Create first route
- Test server in browser/Postman



---

# Phase 3 — MongoDB Connection

Goal:
Connect backend with MongoDB.

Tasks:
- Create MongoDB database
- Install mongoose
- Create db connection
- Create Todo schema/model



---

# Phase 4 — Create Todo API

Goal:
Create CRUD operations.

Tasks:
- GET todos
- POST todo
- PUT update todo
- DELETE todo


---

# Phase 5 — Build Frontend UI

Goal:
Create todo interface.

Tasks:
- Create input field
- Create add button
- Create todo list
- Create checkbox
- Create delete button



---

# Phase 6 — Frontend ↔ Backend Connection

Goal:
Connect React with backend.

Tasks:
- Fetch todos from backend
- Add todo from frontend
- Update todo
- Delete todo



---

# Phase 7 — State Management

Goal:
Update UI dynamically.

Tasks:
- Store todos in state
- Re-render UI after changes
- Handle loading/errors



---

# Phase 8 — Styling

Goal:
Make app look good.

Tasks:
- Responsive layout
- Better spacing
- Hover effects
- Empty state UI


---

# Phase 9 — Final Improvements

Goal:
Add advanced features.

Possible Features:
- Dark mode
- Filters
- Search
- Due dates
- Authentication
- Drag & drop
- Deployment

---

