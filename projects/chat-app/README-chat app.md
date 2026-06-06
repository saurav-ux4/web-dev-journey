# 💬 GroupChat — MERN Stack Group Messaging App

> A WhatsApp-inspired, group-only chat application built with the MERN stack. Admins control access via invitation links, and members collaborate inside organized groups.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [UI Design Reference](#ui-design-reference)
- [Project Phases](#project-phases)
  - [Phase 1 — Project Setup & Auth](#phase-1--project-setup--auth)
  - [Phase 2 — Admin & Member Roles](#phase-2--admin--member-roles)
  - [Phase 3 — Group Management](#phase-3--group-management)
  - [Phase 4 — Real-Time Chatting](#phase-4--real-time-chatting)
  - [Phase 5 — Group Information & Settings](#phase-5--group-information--settings)
  - [Phase 6 — Polish & Deployment](#phase-6--polish--deployment)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Learning Outcomes by Phase](#learning-outcomes-by-phase)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**GroupChat** is a group-only messaging platform where every conversation happens inside a group. There are no one-on-one direct messages. Admins create groups and invite members via a unique invitation link. Members can join only through that link — no open registration into a group.

The app follows a WhatsApp-like UX pattern:
- Left panel: list of your groups
- Right panel: active group chat
- Top bar: group info, settings

---

## Features

### 👑 Admin
- Create and delete groups
- Generate and share a unique invitation link per group
- Add or remove members
- Promote members to admin
- Edit group name, description, and avatar
- Mute or restrict members

### 👤 Member
- Join a group via invitation link
- Send text messages inside groups
- View group information (members list, description)
- Leave a group

### 💬 Chatting Groups
- Real-time messaging using **Socket.IO**
- Message timestamps and read indicators
- Media support (images, files) — Phase 4+
- Typing indicators
- Message history with infinite scroll

### ℹ️ Group Information
- Group name, avatar, and description
- Full members list with roles (Admin / Member)
- Joined date per member
- Invitation link panel (Admin only)

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React.js, Tailwind CSS, Socket.IO Client |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB with Mongoose               |
| Real-time  | Socket.IO                           |
| Auth       | JWT (JSON Web Tokens) + bcrypt      |
| File Upload| Multer + Cloudinary (avatars/media) |
| Deployment | Vercel (Frontend) + Render (Backend) + MongoDB Atlas |

---

## UI Design Reference

Figma Design Kit:
🔗 [E-Chat UI Kit — Figma Community]:https://www.figma.com/design/0pcVrGgLYJL53GutbkuYlJ/Untitled?node-id=0-1&t=QzjY4j1tKRs4oLEY-1

Key screens to implement (in order):
1. Login / Register
2. Groups List (Home)
3. Group Chat View
4. Group Info Panel
5. Invite Link Modal
6. Member Management (Admin)

---

## Project Phases

---

### Phase 1 — Project Setup & Auth

**Goal:** Lay the foundation — monorepo structure, backend server, database connection, and user authentication.

**What you'll build:**
- Initialize `client/` (React + Vite) and `server/` (Node + Express)
- Connect MongoDB via Mongoose
- User model: `name`, `email`, `password`, `avatar`
- Auth routes: `POST /api/auth/register`, `POST /api/auth/login`
- JWT-based protected routes middleware
- Basic login/register UI in React

**What you'll learn:**
- How to structure a MERN project
- How JWT authentication works (signing, verifying tokens)
- How to hash passwords with bcrypt
- How React Router handles page navigation

---

### Phase 2 — Admin & Member Roles

**Goal:** Implement role-based logic so the app knows who is an admin and who is a member in any given group.

**What you'll build:**
- `Group` model: `name`, `description`, `avatar`, `createdBy`, `members: [{ user, role }]`, `inviteCode`
- Role middleware: checks if the requesting user is an admin of the group
- Invitation link generation (`/invite/:code`) — joining via link sets role to `member`
- Admin-only routes (delete group, remove member, promote member)

**What you'll learn:**
- Embedding role data inside a document (MongoDB sub-documents)
- Middleware chaining in Express
- How to generate and validate unique tokens/codes (using `crypto` or `uuid`)
- Conditional UI rendering in React based on user role

---

### Phase 3 — Group Management

**Goal:** Admins can create/edit/delete groups; users can view their groups and join via link.

**What you'll build:**
- `POST /api/groups` — create group
- `GET /api/groups` — list groups the logged-in user belongs to
- `GET /api/groups/:id` — single group details
- `PUT /api/groups/:id` — update group info (admin only)
- `DELETE /api/groups/:id` — delete group (admin only)
- `POST /api/groups/join/:inviteCode` — join via invitation link
- `DELETE /api/groups/:id/leave` — leave group
- Groups List UI (left sidebar like WhatsApp)
- Create Group modal with name, description, avatar upload

**What you'll learn:**
- RESTful API design patterns
- File uploads to Cloudinary using Multer
- Populating MongoDB references (`populate()`)
- Building a sidebar layout in React with state management

---

### Phase 4 — Real-Time Chatting

**Goal:** Members can send and receive messages inside groups in real time.

**What you'll build:**
- `Message` model: `group`, `sender`, `content`, `type` (text/image), `createdAt`
- `GET /api/messages/:groupId` — load message history (paginated)
- Socket.IO server setup on the backend
- Socket events:
  - `join_group` — user joins a group room
  - `send_message` — broadcast message to group room
  - `receive_message` — client receives new message
  - `typing` / `stop_typing` — typing indicator
- Chat UI: message bubbles, sender name, timestamps
- Auto-scroll to latest message
- Typing indicator display

**What you'll learn:**
- How WebSockets differ from HTTP (persistent, bidirectional)
- Rooms in Socket.IO (isolating messages per group)
- Optimistic UI updates (show message immediately, confirm from server)
- Infinite scroll / pagination for message history
- `useEffect` and `useRef` for scroll management in React

---

### Phase 5 — Group Information & Settings

**Goal:** Build the group info panel visible to all members, with extra controls for admins.

**What you'll build:**
- Group Info sidebar/modal:
  - Group avatar, name, description
  - Members list with role badges (Admin / Member)
  - Joined date per member
- Admin controls inside Group Info:
  - Remove member button
  - Promote to admin button
  - Regenerate invite link
  - Copy invite link to clipboard
- `PUT /api/groups/:id/members/:userId/promote`
- `DELETE /api/groups/:id/members/:userId`
- `POST /api/groups/:id/invite/regenerate`

**What you'll learn:**
- Controlled forms for settings editing in React
- Clipboard API (`navigator.clipboard.writeText`)
- Role-based conditional rendering (show admin buttons only to admins)
- Modals and sliding panels with CSS transitions

---

### Phase 6 — Polish & Deployment

**Goal:** Production-ready — optimized, styled, and deployed.

**What you'll build:**
- Responsive design (mobile-first, WhatsApp-like layout)
- Loading skeletons for messages and groups list
- Toast notifications (join success, errors, member removed, etc.)
- Error boundaries in React
- Environment-based config (`.env` for dev and prod)
- Deploy backend to **Render**
- Deploy frontend to **Vercel**
- Use **MongoDB Atlas** for cloud database

**What you'll learn:**
- How to deploy a full-stack MERN app
- Managing CORS between deployed frontend and backend
- Environment variables in production
- Performance: lazy loading components, memoization with `useMemo`/`useCallback`

---

## Folder Structure

```
groupchat/
├── client/                        # React frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── RegisterForm.jsx
│   │   │   ├── Chat/
│   │   │   │   ├── ChatWindow.jsx
│   │   │   │   ├── MessageBubble.jsx
│   │   │   │   ├── MessageInput.jsx
│   │   │   │   └── TypingIndicator.jsx
│   │   │   ├── Group/
│   │   │   │   ├── GroupList.jsx
│   │   │   │   ├── GroupCard.jsx
│   │   │   │   ├── CreateGroupModal.jsx
│   │   │   │   └── GroupInfoPanel.jsx
│   │   │   └── Shared/
│   │   │       ├── Navbar.jsx
│   │   │       ├── Avatar.jsx
│   │   │       └── Toast.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useSocket.js
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── JoinGroup.jsx
│   │   ├── services/
│   │   │   └── api.js             # Axios instance + API calls
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                        # Express backend
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── groupController.js
│   │   └── messageController.js
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification
│   │   └── adminMiddleware.js     # Group admin check
│   ├── models/
│   │   ├── User.js
│   │   ├── Group.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── groupRoutes.js
│   │   └── messageRoutes.js
│   ├── socket/
│   │   └── socketHandler.js       # Socket.IO event handlers
│   ├── utils/
│   │   └── generateInviteCode.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/groupchat.git
cd groupchat
```

### 2. Setup the Server
```bash
cd server
npm install
# Create your .env file (see Environment Variables below)
npm run dev
```

### 3. Setup the Client
```bash
cd client
npm install
npm run dev
```

### 4. Open in Browser
```
http://localhost:5173
```

---

## Environment Variables

### `server/.env`
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/groupchat
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### `client/.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get logged-in user profile |

### Groups
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/groups` | Member | Create a group |
| GET | `/api/groups` | Member | Get all my groups |
| GET | `/api/groups/:id` | Member | Get group details |
| PUT | `/api/groups/:id` | Admin | Update group info |
| DELETE | `/api/groups/:id` | Admin | Delete group |
| POST | `/api/groups/join/:inviteCode` | Anyone | Join via invite link |
| DELETE | `/api/groups/:id/leave` | Member | Leave group |
| DELETE | `/api/groups/:id/members/:userId` | Admin | Remove a member |
| PUT | `/api/groups/:id/members/:userId/promote` | Admin | Promote to admin |
| POST | `/api/groups/:id/invite/regenerate` | Admin | New invite link |

### Messages
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/messages/:groupId` | Member | Get message history |
| POST | `/api/messages/:groupId` | Member | Send a message |

### Socket Events
| Event | Direction | Description |
|-------|-----------|-------------|
| `join_group` | Client → Server | Join a group's socket room |
| `send_message` | Client → Server | Send a new message |
| `receive_message` | Server → Client | Receive a message in the group |
| `typing` | Client → Server | User started typing |
| `stop_typing` | Client → Server | User stopped typing |
| `user_typing` | Server → Client | Notify others of typing |

---

## Learning Outcomes by Phase

| Phase | Key Concepts Learned |
|-------|----------------------|
| 1 | MERN setup, JWT auth, bcrypt, REST basics |
| 2 | Role-based access, middleware chaining, invite codes |
| 3 | CRUD APIs, file upload, MongoDB populate, sidebar UI |
| 4 | WebSockets, Socket.IO rooms, real-time state, pagination |
| 5 | Settings UI, admin controls, Clipboard API, modals |
| 6 | Deployment, CORS, env configs, performance patterns |

---

## Contributing

This project is built as a learning journey. Contributions, suggestions, and improvements are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

MIT License © 2026 — Built with ❤️ using the MERN Stack
