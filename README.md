# 'Āina Bucks

> A platform for Hawaii Volunteers

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

---
## 📖 About

‘Aina Bucks is a mobile app that streamlines volunteer event management through QR code check-ins and automated attendance tracking for organizers. It encourages volunteer engagement through rewards where volunteers contribute time or labor to community projects, earn "bucks" and redeem them for goods

### Key Features

- 🔒 Secure authentication with Neon Auth
- 💾 PostgreSQL database with Drizzle ORM
- ⚡ Fast, modern UI built with Next.js 15 and Tailwind CSS

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ and npm installed
- A **Neon** account ([Sign up here](https://neon.com/))
- **Neon Auth** keys ([Setup guide](https://neon.com/docs/neon-auth/quick-start/nextjs))

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ainabucks
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory based on `.env.example`:

   ```bash
   cp .env.sample .env
   ```

   Update `.env` with your credentials:

   ```bash
    # Required: Neon Auth environment variables for Next.js
    NEXT_PUBLIC_STACK_PROJECT_ID='your_project_id_here'
    NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY='your_publishable_client_key_here'
    STACK_SECRET_SERVER_KEY='your_secret_server_key_here'

    # Required: Database owner connection string
    DATABASE_URL='your_database_url_here'
   ```

4. **Set up the database**

```bash
   npm run db:push    # Push schema to database
   # OR
   npm run db:migrate # Run migrations (for production)
```

5. **Run the development server**

```bash
   npm run dev
```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

---
## 📚 Architecture Overview

### Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui components

**Backend:**
- Next.js API Routes
- Neon PostgreSQL (Serverless)
- Drizzle ORM

**Authentication:**
- Neon Auth (Stack Auth integration)

### Database Schema

Main tables:
- `users_table` - User accounts and profiles
- [Add other main tables]

See [`database/schema.ts`](./database/schema.ts) for the complete schema.

---

## 🔌 API Routes

### Authentication

- `POST /api/auth/sign-up` - Create new user account
- `POST /api/auth/sign-in` - User login
- `POST /api/auth/sign-out` - User logout

**Endpoint:** ``

[add API route decription]

**Request:**

```json

```

**Response:**

```json

```

---

## 🎨 UI Components

###

**File:** ``

Features:

-

---

## 🔧 Development Commands

```bash
# Development
npm install             # Intall dependencies
npm run dev             # Start dev server with Turbopack

# Database Management
npm run db:generate     # Generate migrations
npm run db:migrate      # Run migrations
npm run db:push         # Push changes directly onto database

# Build
npm run build           # Build for production

# Production
npm start               # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run format:fix      # Format code with Prettier

```

---

## 📝 Contributing

### Code Style

- Use TypeScript strict mode
- Follow ESLint and Prettier rules
- Add JSDoc comments for functions
- Include console logs for debugging

---

## 🙏 Acknowledgments

- **Purple Mai'a Foundation** - Project vision and support

---

## 📞 Support

For questions or issues:

- Open an issue on GitHub
- Contact: splimon@hawaiii.edu

---
