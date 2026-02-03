"# SkillBridge - Backend

A full-stack web application that connects learners with expert tutors, enabling seamless learning experiences.

## Project Overview

SkillBridge is a comprehensive tutoring platform built with modern web technologies. Students can browse tutor profiles, view availability, and book sessions instantly. Tutors can manage their profiles, set availability, and track their teaching sessions. Admins oversee the platform and manage users to ensure quality and safety.

## Tech Stack

- **Backend Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Language**: TypeScript
- **Runtime**: Node.js

## Roles & Permissions

| Role        | Description                         | Key Permissions                                                  |
| ----------- | ----------------------------------- | ---------------------------------------------------------------- |
| **Student** | Learners who book tutoring sessions | Browse tutors, book sessions, leave reviews, manage profile      |
| **Tutor**   | Experts who offer tutoring services | Create profile, set availability, view bookings, manage subjects |
| **Admin**   | Platform moderators                 | Manage all users, view analytics, moderate content               |

💡 **Note**: Users select their role during registration. Admin accounts should be seeded in the database.

## Project Structure

```
Backend/
├── src/
│   ├── app.ts                 # Express app setup
│   ├── server.ts              # Server entry point
│   ├── middleware/            # Custom middleware (auth, error handling)
│   ├── module/                # Feature modules (admin, bookings, student, tutor, etc.)
│   ├── lib/                   # Utility libraries (Prisma, auth)
│   ├── utils/                 # Helper functions
│   ├── types/                 # TypeScript type definitions
│   └── router/                # Route configuration
├── prisma/
│   ├── schema/                # Prisma schema files
│   ├── migrations/            # Database migrations
│   └── generated/             # Generated Prisma client
├── api/                       # API deployment configuration
└── tsconfig.json              # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**
   Create a `.env` file in the root directory:

   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/skillbridge"
   NODE_ENV="development"
   PORT=3000
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Setup database**

   ```bash
   npm run prisma:push
   # or for migrations
   npm run prisma:migrate
   ```

5. **Seed the database (optional)**

   ```bash
   npm run prisma:seed
   ```

6. **Start the server**

   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run prisma:migrate` - Create and apply migrations
- `npm run prisma:push` - Sync schema to database
- `npm run prisma:studio` - Open Prisma Studio (visual database manager)

## API Modules

### Public Module

- Browse tutor profiles
- View categories and tutors

### Student Module

- Dashboard
- Book tutoring sessions
- Manage profile and bookings
- Leave reviews

### Tutor Module

- Manage profile
- Set availability
- View student bookings
- Manage subjects/categories

### Admin Module

- Dashboard with analytics
- Manage all users
- Monitor bookings

### Bookings Module

- Create and manage bookings
- Track booking status

### Categories Module

- Manage tutoring categories
- Filter tutors by category

## Database Schema

The project uses Prisma with the following main entities:

- **User** - Core user information with role-based authentication
- **TutorProfile** - Extended tutor information
- **Category** - Tutoring subjects/categories
- **Booking** - Session bookings between students and tutors
- **Review** - Student reviews for tutors
- **TutorAvailability** - Tutor availability slots

## Authentication

- JWT-based authentication
- Role-based access control (RBAC)
- Protected routes via middleware

### Default Admin Credentials

For development and testing purposes, use the following admin account:

- **Email**: `elonmusk@tesla.com`
- **Password**: `elonmusk123`

⚠️ **Important**: Change these credentials in production. This account should be deleted or updated with secure credentials before deploying to production.

## Error Handling

Global error handler middleware processes all application errors and returns consistent error responses.

## Development Workflow

1. Create feature branch from `main`
2. Follow TypeScript best practices
3. Use Prisma migrations for schema changes
4. Test API endpoints before pushing
5. Create pull request for code review

## Contributing

1. Follow the existing code structure
2. Use TypeScript for all new code
3. Add proper type definitions
4. Keep modules focused and single-responsibility

## Support

For issues or questions, please create an issue in the repository.

---

**Last Updated**: February 2026"
