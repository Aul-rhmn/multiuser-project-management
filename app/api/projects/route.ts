import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 })
    }

    // Create project
    const projectResult = await sql`
      INSERT INTO projects (name, owner_id)
      VALUES (${name}, ${session.userId})
      RETURNING id, name, owner_id, created_at, updated_at
    `

    const project = projectResult[0]

    // Add owner as member
    await sql`
      INSERT INTO memberships (user_id, project_id)
      VALUES (${session.userId}, ${project.id})
    `

    return NextResponse.json(project)
  } catch (error) {
    console.error("Create project error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
