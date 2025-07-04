import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import type { Project, TaskWithAssignee } from "@/lib/db"
import { KanbanBoard } from "@/components/kanban-board"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Settings } from "lucide-react"
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

async function getTasks(projectId: string): Promise<TaskWithAssignee[]> {
  const tasks = await sql`
    SELECT t.*, u.email as assignee_email
    FROM tasks t
    LEFT JOIN users u ON t.assignee_id = u.id
    WHERE t.project_id = ${projectId}
    ORDER BY t.created_at DESC
  `
  return tasks as TaskWithAssignee[]
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const project = await getProject(params.id, session.userId)

  if (!project) {
    redirect("/dashboard")
  }

  const tasks = await getTasks(params.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                <p className="text-gray-600">Project Board</p>
              </div>
            </div>
            <Link href={`/projects/${params.id}/settings`}>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <KanbanBoard projectId={params.id} tasks={tasks} />
      </main>
    </div>
  )
}
