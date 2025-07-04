import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, status, projectId } = await request.json()

    if (!title || !projectId) {
      return NextResponse.json({ error: "Title and project ID are required" }, { status: 400 })
    }

    // Check if user is a member of the project
    const memberships = await sql`
      SELECT id FROM memberships 
      WHERE user_id = ${session.userId} AND project_id = ${projectId}
    `

    if (memberships.length === 0) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Create task
    const result = await sql`
      INSERT INTO tasks (title, description, status, project_id)
      VALUES (${title}, ${description || null}, ${status || "todo"}, ${projectId})
      RETURNING id, title, description, status, project_id, assignee_id, created_at, updated_at
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Create task error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
