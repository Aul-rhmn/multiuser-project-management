import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import type { Project } from "@/lib/db"
import { InviteMemberForm } from "@/components/invite-member-form"
import { MembersList } from "@/components/members-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

async function getProject(projectId: string, userId: string): Promise<Project | null> {
  const projects = await sql`
    SELECT p.*
    FROM projects p
    JOIN memberships m ON p.id = m.project_id
    WHERE p.id = ${projectId} AND m.user_id = ${userId}
  `
  return (projects[0] as Project) || null
}

async function getProjectMembers(projectId: string) {
  const members = await sql`
    SELECT u.id, u.email, p.owner_id = u.id as is_owner
    FROM users u
    JOIN memberships m ON u.id = m.user_id
    JOIN projects p ON m.project_id = p.id
    WHERE m.project_id = ${projectId}
    ORDER BY is_owner DESC, u.email
  `
  return members
}

export default async function ProjectSettingsPage({ params }: { params: { id: string } }) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const project = await getProject(params.id, session.userId)

  if (!project) {
    redirect("/dashboard")
  }

  const members = await getProjectMembers(params.id)
  const isOwner = project.owner_id === session.userId

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-4">
            <Link href={`/projects/${params.id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Project
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-gray-600">Project Settings</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Project Members</CardTitle>
              <CardDescription>Manage who has access to this project</CardDescription>
            </CardHeader>
            <CardContent>
              <MembersList members={members} projectId={params.id} isOwner={isOwner} />
            </CardContent>
          </Card>

          {isOwner && (
            <Card>
              <CardHeader>
                <CardTitle>Invite Members</CardTitle>
                <CardDescription>Add new members to your project</CardDescription>
              </CardHeader>
              <CardContent>
                <InviteMemberForm projectId={params.id} />
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
