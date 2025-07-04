import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

export const sql = neon(process.env.DATABASE_URL)

export type User = {
  id: string
  email: string
  password: string
  created_at: string
  updated_at: string
}

export type Project = {
  id: string
  name: string
  owner_id: string
  created_at: string
  updated_at: string
}

export type Task = {
  id: string
  title: string
  description: string | null
  status: "todo" | "in-progress" | "done"
  project_id: string
  assignee_id: string | null
  created_at: string
  updated_at: string
}

export type Membership = {
  id: string
  user_id: string
  project_id: string
  created_at: string
}

export type ProjectWithOwner = Project & {
  owner_email: string
}

export type TaskWithAssignee = Task & {
  assignee_email: string | null
}
