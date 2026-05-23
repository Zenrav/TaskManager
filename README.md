# TaskManager API

A production-grade REST API for managing tasks across teams, built with Node.js, Express, and MongoDB. Features JWT authentication, role-based access control, Redis caching, BullMQ job queues, and an AI-powered scheduling assistant.

---

## Features

- **Authentication** — JWT access and refresh tokens with httpOnly cookies
- **Session Management** — Track active sessions, logout, and logout from all devices
- **Role Based Access Control** — Separate permissions for managers and engineers
- **Task Management** — Full CRUD with priority scoring based on deadline and importance
- **Email Reminders** — Automated 2-day deadline reminders via BullMQ job queues
- **Redis Caching** — Query result caching with automatic invalidation
- **Rate Limiting** — Per-route rate limiting and bot detection via Arcjet
- **Input Validation** — Schema-based validation using Zod
- **AI Assistant** — Gemini-powered daily schedule generator and task Q&A for engineers

---

## Tech Stack

| Category | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Cache + Queue | Redis + BullMQ |
| Authentication | JWT (access + refresh tokens) |
| Validation | Zod |
| Email | Nodemailer |
| Security | Arcjet (rate limiting + bot detection) |
| AI | Anthropic Claude API |
| Scheduling | node-cron |

---

## Project Structure

```
TaskManager/
├── controllers/
│   ├── auth.controller.js
│   ├── tasks.controller.js
│   ├── user.controller.js
│   └── ai.controller.js
├── models/
│   ├── user.model.js
│   ├── task.model.js
│   └── session.model.js
├── routes/
│   ├── auth.route.js
│   ├── tasks.route.js
│   ├── user.route.js
│   └── ai.route.js
├── middleware/
│   ├── auth.middleware.js
│   ├── authorize.middleware.js
│   └── validate.middleware.js
├── queues/
│   ├── emailQueue.js
│   └── emailWorker.js
├── config/
│   ├── env.js
│   ├── redis.js
│   ├── nodemailer.js
│   └── arcjet.js
├── utils/
│   ├── cache.js
│   ├── priority.js
│   ├── cronlogic.js
│   └── validation.js
├── templates/
│   └── email_template.js
├── app.js
└── .env
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- Redis (local or Redis Cloud)
- Anthropic API key
- Arcjet API key

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/task-manager.git
cd task-manager

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
DB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN_ACCESS=15m
JWT_EXPIRES_IN_REFRESH=7d
EMAIL_PASSWORD=your_email_password
ARCJET_KEY=your_arcjet_key
REDIS_URL=your_redis_connection_string
ANTHROPIC_API_KEY=your_anthropic_api_key
NODE_ENV=development
```

### Run the server

```bash
node app.js
```

Server runs on `http://localhost:3000`

---

## API Endpoints

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new manager |
| POST | `/api/auth/login` | Public | Login and get tokens |
| GET | `/api/auth/refresh-token` | Public | Refresh access token |
| GET | `/api/auth/logout` | Private | Logout current session |
| GET | `/api/auth/logout-all` | Private | Logout all devices |

### Tasks

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/tasks` | Manager | Get all tasks with filters |
| POST | `/api/tasks` | Manager | Create a new task |
| GET | `/api/tasks/my-tasks` | Engineer | Get my assigned tasks |
| GET | `/api/tasks/:id` | Manager | Get task by ID |
| PUT | `/api/tasks/:id` | Manager | Update a task |
| DELETE | `/api/tasks/:id` | Manager | Delete a task |

### Users

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/users` | Manager | Get all users |
| GET | `/api/users/:userId` | Manager + Engineer | Get user by ID |
| POST | `/api/users/create` | Manager | Create an engineer |
| PUT | `/api/users/:userId` | Manager | Update a user |
| DELETE | `/api/users/:id` | Manager | Delete a user |

### AI Assistant

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/ai/schedule` | Engineer | Generate daily schedule |
| POST | `/api/ai/ask` | Engineer | Ask about your tasks |

---

## Authentication

This API uses JWT-based authentication with two tokens:

- **Access Token** — Short-lived (15 mins), sent in the `Authorization` header
- **Refresh Token** — Long-lived (7 days), stored in an httpOnly cookie

Include the access token in every protected request:

```
Authorization: Bearer <access_token>
```

---

## Role Based Access

| Action | Manager | Engineer |
|---|---|---|
| Register | ✅ | ❌ |
| Create tasks | ✅ | ❌ |
| Assign tasks | ✅ | ❌ |
| View all tasks | ✅ | ❌ |
| View own tasks | ✅ | ✅ |
| Update task status | ✅ | ✅ |
| Delete tasks | ✅ | ❌ |
| Create engineers | ✅ | ❌ |
| View any user | ✅ | ✅ |
| AI schedule | ❌ | ✅ |
| AI Q&A | ❌ | ✅ |

---

## Priority Score

Every task gets a dynamic priority score calculated from:

- **Importance** — high (3x), medium (2x), low (1x)
- **Deadline** — closer deadlines get higher scores
- **Status** — pending tasks scored higher than in-progress

---

## Email Reminders

A cron job runs every minute checking for tasks due in exactly 2 days. When found:

1. A job is added to the BullMQ email queue
2. The email worker picks up the job independently
3. A reminder email is sent to the assigned engineer
4. `reminderSent` is set to `true` to prevent duplicate emails

---

## AI Assistant

Engineers can interact with an AI assistant powered by Claude:

**Generate Schedule:**
```
GET /api/ai/schedule
Headers: Authorization: Bearer <engineer_token>
```

**Ask a Question:**
```json
POST /api/ai/ask
{
    "question": "Which task should I focus on today?"
}
```

Claude analyzes the engineer's tasks, deadlines, and priority scores to provide personalized recommendations.

---

## Caching Strategy

Redis caching is implemented on all GET routes:

| Cache Key | TTL | Invalidated On |
|---|---|---|
| `tasks:all:{filters}` | 5 mins | create, update, delete task |
| `tasks:engineer:{id}` | 2 mins | create, update, delete task |
| `tasks:single:{id}` | 5 mins | update, delete task |

---

## License

MIT
