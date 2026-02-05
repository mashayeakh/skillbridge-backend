# SkillBridge - Backend API

A robust backend service for a comprehensive tutoring platform that connects learners with expert tutors, enabling seamless learning experiences.

## 📋 Project Overview

SkillBridge Backend is a production-ready REST API built with modern web technologies. It provides a scalable foundation for a tutoring marketplace where:

- **Students** can discover qualified tutors, view real-time availability, and book personalized learning sessions
- **Tutors** can manage professional profiles, define flexible availability schedules, and track teaching engagements
- **Administrators** oversee platform operations, manage user accounts, and monitor analytics

The platform implements enterprise-grade authentication, role-based access control, and comprehensive error handling.

## 🛠️ Tech Stack

| Component     | Technology        |
| ------------- | ----------------- |
| **Framework** | Express.js (v4.x) |
| **Language**  | TypeScript        |
| **Runtime**   | Node.js (v16+)    |
| **Database**  | PostgreSQL (v12+) |
| **ORM**       | Prisma            |

## 👥 User Roles & Permissions

| Role        | Responsibilities                   | Permissions                                                                              |
| ----------- | ---------------------------------- | ---------------------------------------------------------------------------------------- |
| **Student** | Learning through tutoring sessions | Browse tutors, book sessions, leave reviews, manage profile and bookings                 |
| **Tutor**   | Providing tutoring services        | Create/update profile, set availability, view bookings, manage subjects and availability |
| **Admin**   | Platform governance & operations   | Manage users, view analytics, moderate content, system management                        |

> **Note**: Users select their role during registration. Admin accounts should be created via database seeding or direct database administration.

## 📁 Project Structure

```
Backend/
├── src/                       # Application source code
│   ├── app.ts                 # Express application setup
│   ├── server.ts              # Server entry point and initialization
│   ├── middleware/            # Custom middleware (authentication, error handling)
│   ├── module/                # Feature modules (admin, bookings, student, tutor, etc.)
│   │   ├── admin/             # Admin dashboard and management
│   │   ├── bookings/          # Booking management logic
│   │   ├── student/           # Student-specific features
│   │   ├── tutor/             # Tutor profile and management
│   │   ├── categories/        # Category/subject management
│   │   └── public/            # Public-facing features
│   ├── lib/                   # Shared libraries (Prisma, authentication)
│   ├── utils/                 # Helper functions and utilities
│   ├── types/                 # TypeScript type definitions
│   ├── error/                 # Custom error classes
│   └── router/                # Route configuration and aggregation
├── prisma/
│   ├── schema/                # Prisma schema definitions (modular)
│   ├── migrations/            # Database migration history
│   └── generated/             # Auto-generated Prisma client
├── tsconfig.json              # TypeScript configuration
└── package.json               # Project dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16 or higher
- **npm** v8 or higher (or yarn)
- **PostgreSQL** v12 or higher
- **Git** for version control

### Installation & Setup

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd Backend
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/skillbridge"

# Application Configuration
NODE_ENV="development"
PORT=3000

# Authentication
JWT_SECRET=your_highly_secure_jwt_secret_key_change_in_production
```

#### 4. Setup Database

```bash
# Sync Prisma schema with database
npm run prisma:push

# Or create and apply migrations
npm run prisma:migrate
```

#### 5. Seed Database (Optional)

```bash
npm run prisma:seed
```

#### 6. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## 📦 Available Scripts

| Command                  | Description                                    |
| ------------------------ | ---------------------------------------------- |
| `npm run dev`            | Start development server with hot reload       |
| `npm run build`          | Compile TypeScript to JavaScript               |
| `npm start`              | Start production server                        |
| `npm run prisma:migrate` | Create and apply database migrations           |
| `npm run prisma:push`    | Synchronize Prisma schema with database        |
| `npm run prisma:studio`  | Launch Prisma Studio (visual database manager) |

## 🔌 API Modules

### Public Module

Browse and discover tutoring services without authentication

- Search tutor profiles
- View available tutoring categories
- Filter tutors by specialty and availability

### Student Module

Complete learning and session management

- Personal dashboard with booking history
- Book tutoring sessions with available tutors
- Manage profile and account settings
- Submit reviews and ratings for completed sessions
- Track upcoming and past bookings

### Tutor Module

Professional profile and teaching management

- Create and manage tutor profile with qualifications
- Set and update teaching availability schedules
- View and manage student bookings
- Manage teaching subjects and categories
- Monitor earnings and session history

### Admin Module

Platform administration and analytics

- Comprehensive admin dashboard with key metrics
- Manage all platform users (create, update, deactivate)
- Monitor and manage all bookings
- Generate analytics and reports
- Content moderation and platform oversight

### Bookings Module

Session booking and management system

- Create new tutoring session bookings
- Update booking status and details
- Cancel or reschedule sessions
- Track booking lifecycle and history

### Categories Module

Tutoring subjects and specialization management

- Manage available tutoring categories/subjects
- Organize tutoring offerings
- Filter and categorize tutors by expertise

## 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM and defines the following core entities:

| Entity                | Purpose                                                   |
| --------------------- | --------------------------------------------------------- |
| **User**              | Core user account with authentication and role management |
| **TutorProfile**      | Extended professional information for tutor accounts      |
| **Category**          | Tutoring subjects, specializations, and course categories |
| **Booking**           | Tutoring session bookings and scheduling                  |
| **Review**            | Student feedback and ratings for completed sessions       |
| **TutorAvailability** | Tutor availability slots and scheduling                   |

All schema definitions are located in the `prisma/schema/` directory for better organization and maintainability.

## 🔐 Authentication & Authorization

### Security Implementation

- **JWT (JSON Web Tokens)** for stateless authentication
- **Role-Based Access Control (RBAC)** for fine-grained permissions
- **Protected routes** via middleware authentication
- **Password security** with industry-standard practices

### Default Admin Account (Development Only)

For development and testing purposes, the following credentials are provided:

| Field        | Value                |
| ------------ | -------------------- |
| **Email**    | `elonmusk@tesla.com` |
| **Password** | `elonmusk123`        |

> ⚠️ **CRITICAL - PRODUCTION SECURITY**: This default account MUST be deleted or updated with secure credentials before deploying to production. Do not use development credentials in live environments.

## ⚠️ Error Handling

The application implements a global error handling middleware that:

- Catches and processes all application errors
- Returns consistent, structured error responses
- Implements proper HTTP status codes
- Provides meaningful error messages for debugging
- Logs errors for monitoring and analysis

All errors follow a standardized response format for predictable client-side handling.

## 💻 Development Workflow

### Best Practices

1. **Branching**: Create feature branches from `main` with descriptive names
2. **Code Quality**: Follow TypeScript best practices and maintain type safety
3. **Database Changes**: Use Prisma migrations for all schema modifications
4. **Testing**: Test all API endpoints before committing changes
5. **Code Review**: Submit pull requests for peer review before merging

### Commit Guidelines

- Write clear, descriptive commit messages
- Reference related issues in commit messages
- Keep commits focused on single features or fixes

## 🤝 Contributing

We welcome contributions to SkillBridge Backend. Please follow these guidelines:

1. **Code Standards**
   - Write all new code in TypeScript
   - Add proper type definitions and interfaces
   - Follow existing code style and conventions
   - Ensure proper error handling

2. **Architecture**
   - Keep modules focused and single-responsibility
   - Maintain separation of concerns (controllers, services, repositories)
   - Document complex logic with comments
   - Reuse existing utilities and helpers

3. **Database**
   - Create migrations for all schema changes
   - Name migrations descriptively
   - Test migrations in development before committing

4. **Submission**
   - Create a descriptive pull request
   - Include details of changes and reasoning
   - Ensure all tests pass before submission
   - Address code review feedback promptly

## 📞 Support & Documentation

### Getting Help

- **Issues**: Report bugs or request features via GitHub Issues
- **Discussions**: Ask questions and share ideas in Discussions
- **Documentation**: Check the project wiki for detailed guides

### Useful Resources

- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## 📄 License

This project is part of an academic assignment. All rights reserved.

**Last Updated**: February 2026  
**Status**: Active Development"
