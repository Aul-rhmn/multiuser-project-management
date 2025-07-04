import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ProjectWithOwner } from "@/lib/db"

interface ProjectCardProps {
  project: ProjectWithOwner
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{project.name}</CardTitle>
            <Badge variant="secondary">Active</Badge>
          </div>
          <CardDescription>Owner: {project.owner_email}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Created {new Date(project.created_at).toLocaleDateString()}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
