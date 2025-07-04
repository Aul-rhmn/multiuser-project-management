import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { status } = await request.json()

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    // Check if user has access to the task's project
    const tasks = await sql`
      SELECT t.project_id 
      FROM tasks t
      JOIN memberships m ON t.project_id = m.project_id
      WHERE t.id = ${params.id} AND m.user_id = ${session.userId}
    `

    if (tasks.length === 0) {
      return NextResponse.json({ error: "Task not found or forbidden" }, { status: 404 })
    }

    // Update task status
    const result = await sql`
      UPDATE tasks 
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${params.id}
      RETURNING id, title, description, status, project_id, assignee_id, created_at, updated_at
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Update task error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
