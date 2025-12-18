# Collaborative Task Manager

A full-stack, real-time task management application built with Next.js, Express, MongoDB, and Socket.io.

## Tech Stack

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Fetching**: SWR
- **Forms**: React Hook Form + Zod
- **Real-time**: Socket.io Client

### Backend

- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **Database**: MongoDB
- **ORM**: Prisma
- **Authentication**: JWT (HttpOnly Cookies) + bcrypt
- **Validation**: Zod (DTOs)
- **Real-time**: Socket.io
- **Testing**: Jest

## Features

- Secure user authentication with JWT
- Full CRUD operations for tasks
- Real-time task updates across all clients
- Instant in-app notifications for task assignments
- Personal dashboard with filtering & sorting
- Responsive design (mobile & desktop)
- Skeleton loading states
- Form validation with error handling
- Service/Repository pattern architecture
- Comprehensive error handling
- Unit tests for critical logic

## Architecture Overview

### Backend Architecture

The backend follows a **layered architecture** with clear separation of concerns:

```
Controllers → Services → Repositories → Database
```

- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Repositories**: Data access layer (Prisma)
- **DTOs**: Input validation using Zod
- **Middleware**: Authentication, error handling

### Why MongoDB?

MongoDB was chosen for this project because:

- Flexible schema for evolving task requirements
- Excellent performance for read-heavy operations (dashboards)
- Native support in Prisma
- Easy horizontal scaling for real-time applications

### JWT Strategy

- Tokens stored in **HttpOnly cookies** for XSS protection
- Refresh token rotation for enhanced security
- Automatic token refresh on client

### Socket.io Integration

- Separate Socket.io server attached to Express
- JWT authentication for socket connections
- Room-based broadcasting for efficient updates
- Events: `task:created`, `task:updated`, `task:assigned`

## Deplyoment URL

[View Demo]()

## GitHub Link

**Git Clone**

```bash
https://github.com/vishnuu5/Task-Manager-Ablespace.git
```

## Local Development Setup

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```bash
DATABASE_URL=
JWT_SECRET="jwt-key"
JWT_REFRESH_SECRET=
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

4. Generate Prisma client and push schema:

```bash
npx prisma generate
npx prisma db push
```

5. Run tests:

```bash
npm test
```

6. Start development server:

```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

4. Start development server:

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## Deployment

**See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.**

### Quick Start

**Backend (Render):**

1. Create MongoDB Atlas database
2. Create Render Web Service
3. Set root directory to `backend`
4. Add environment variables
5. Deploy with build command: `npm install && npx prisma generate && npm run build`

**Frontend (Vercel):**

1. Import project to Vercel
2. Set root directory to `frontend`
3. Add `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SOCKET_URL` environment variables
4. Deploy

## API Documentation

### Authentication Endpoints

#### Register User

```
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "Raju"
}
```

#### Login

```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### Get Current User

```
GET /api/v1/auth/me
Authorization: Bearer <token>
```

#### Update Profile

```
PATCH /api/v1/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Raju"
}
```

### Task Endpoints

#### Create Task

```
POST /api/v1/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the task manager app",
  "dueDate": "2025-12-31T23:59:59Z",
  "priority": "High",
  "status": "To Do",
  "assignedToId": "user-id-here"
}
```

#### Get All Tasks

```
GET /api/v1/tasks?status=To Do&priority=High&sortBy=dueDate
Authorization: Bearer <token>
```

#### Get Task by ID

```
GET /api/v1/tasks/:id
Authorization: Bearer <token>
```

#### Update Task

```
PATCH /api/v1/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "In Progress",
  "priority": "Urgent"
}
```

#### Delete Task

```
DELETE /api/v1/tasks/:id
Authorization: Bearer <token>
```

#### Get Dashboard Data

```
GET /api/v1/tasks/dashboard/stats
Authorization: Bearer <token>
```

### Notification Endpoints

#### Get User Notifications

```
GET /api/v1/notifications
Authorization: Bearer <token>
```

#### Mark Notification as Read

```
PATCH /api/v1/notifications/:id/read
Authorization: Bearer <token>
```

## Testing

Backend tests are located in `backend/tests/` and cover:

- Task creation validation
- Task assignment logic
- Authentication middleware

Run tests:

```bash
cd backend
npm test
```

## Real-Time Events

### Socket Events

**Client → Server:**

- `join`: Join user's personal room
- `leave`: Leave room

**Server → Client:**

- `task:created`: New task created
- `task:updated`: Task updated
- `task:deleted`: Task deleted
- `task:assigned`: Task assigned to user
- `notification:new`: New notification

## Trade-offs & Assumptions

1. **HttpOnly Cookies**: Chosen over localStorage for better XSS protection, but requires same-origin or proper CORS setup
2. **MongoDB**: Flexible schema chosen over PostgreSQL for easier iteration, trade-off is less strict relational integrity
3. **Polling Fallback**: Socket.io has built-in fallback to polling if WebSocket connection fails
4. **Optimistic Updates**: Not fully implemented to keep complexity manageable within timeline
5. **Pagination**: Basic implementation - production would need cursor-based pagination for large datasets

## Design Decisions

1. **Repository Pattern**: Abstracts data access, making it easy to swap Prisma for another ORM
2. **DTO Validation**: Zod schemas ensure type safety and runtime validation
3. **Error Handling**: Centralized error handler with consistent response format
4. **Socket Authentication**: Validates JWT on socket connection for security
5. **SWR**: Chosen for automatic revalidation and cache management

## License

MIT
