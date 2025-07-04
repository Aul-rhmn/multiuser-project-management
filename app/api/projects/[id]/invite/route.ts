import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check if user is project owner
    const projects = await sql`
      SELECT owner_id FROM projects WHERE id = ${params.id}
    `

    if (projects.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    if (projects[0].owner_id !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Find user to invite
    const users = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userId = users[0].id

    // Check if user is already a member
    const existingMembership = await sql`
      SELECT id FROM memberships 
      WHERE user_id = ${userId} AND project_id = ${params.id}
    `

    if (existingMembership.length > 0) {
      return NextResponse.json({ error: "User is already a member" }, { status: 400 })
    }

    // Add user as member
    await sql`
      INSERT INTO memberships (user_id, project_id)
      VALUES (${userId}, ${params.id})
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Invite member error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
