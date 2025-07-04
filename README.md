# Multi-User Project Management App

A full-stack project management tool built with Next.js, PostgreSQL, and modern web technologies. Supports team collaboration, kanban task management, and user authentication.

## Live Demo

Try the app here:
[https://multiuser-project-management-24vn.vercel.app/](https://multiuser-project-management-24vn.vercel.app/)

**Demo Credentials**
Email: `user@example.com`
Password: `user`

## Features

### Authentication

* Register and log in securely
* Password hashing with bcrypt
* JWT-based authentication
* HTTP-only cookies for sessions

### Project Management

* Create and manage projects
* Invite team members via email
* Role-based access (owner/member)

### Task Management (Kanban)

* Drag-and-drop kanban board
* Tasks with title, description, assignee
* Visual task cards for team collaboration

### Tech Stack

**Frontend**

* Next.js 14 (App Router)
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide React

**Backend**

* PostgreSQL
* Neon (PostgreSQL hosting)
* Next.js API routes
* bcryptjs
* JSON Web Tokens (JWT)

**Database Schema**

* Users
* Projects
* Memberships
* Tasks

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Aul-rhmn/sp_fs_muhammad_aulia_rahman.git
cd sp_fs_muhammad_aulia_rahman
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env.local` file:

```env
DATABASE_URL=postgresql://neondb_owner:npg_tZKJ3Ol7dNXG@ep-long-sun-a250yc60.eu-central-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=Wa+t+jA7x23jYt/tzk09dOOij290pFQJT9tSkXLFlzs=
```

### 4. Set Up the Database

```bash
# Create tables and seed data
npm run db:setup

# Or run manually
psql $DATABASE_URL -f scripts/001-create-tables.sql
psql $DATABASE_URL -f scripts/002-seed-data.sql
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel

1. Connect GitHub repo to Vercel
2. Set environment variables in project settings
3. Deploy automatically from `main` branch


## GitHub Repository

Code available at:
[https://github.com/Aul-rhmn/sp\_fs\_muhammad\_aulia\_rahman](https://github.com/Aul-rhmn/sp_fs_muhammad_aulia_rahman)

## License
