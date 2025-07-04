import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import type { ProjectWithOwner } from "@/lib/db"
import { ProjectCard } from "@/components/project-card"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { Button } from "@/components/ui/button"
import { LogOut, Plus } from "lucide-react"
import { logoutAction } from "@/app/actions/auth"

async function getProjects(userId: string): Promise<ProjectWithOwner[]> {
  const projects = await sql`
    SELECT p.*, u.email as owner_email
    FROM projects p
    JOIN users u ON p.owner_id = u.id
    JOIN memberships m ON p.id = m.project_id
    WHERE m.user_id = ${userId}
    ORDER BY p.created_at DESC
  `
  return projects as ProjectWithOwner[]
}

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const projects = await getProjects(session.userId)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {session.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <CreateProjectDialog>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </CreateProjectDialog>
              <form action={logoutAction}>
                <Button variant="outline" type="submit">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Projects</h2>
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No projects yet</p>
              <CreateProjectDialog>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create your first project
                </Button>
              </CreateProjectDialog>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
