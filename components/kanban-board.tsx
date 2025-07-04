"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { Plus } from "lucide-react"
import type { TaskWithAssignee } from "@/lib/db"

interface KanbanBoardProps {
  projectId: string
  tasks: TaskWithAssignee[]
}

const statusConfig = {
  todo: { label: "To Do", color: "bg-gray-100" },
  "in-progress": { label: "In Progress", color: "bg-blue-100" },
  done: { label: "Done", color: "bg-green-100" },
}

export function KanbanBoard({ projectId, tasks }: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null)
  const router = useRouter()

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()

    if (!draggedTask) return

    try {
      const response = await fetch(`/api/tasks/${draggedTask}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to update task status:", error)
    }

    setDraggedTask(null)
  }

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Object.entries(statusConfig).map(([status, config]) => (
        <div
          key={status}
          className={`${config.color} rounded-lg p-4 min-h-[500px]`}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, status)}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">{config.label}</h3>
            <CreateTaskDialog projectId={projectId} defaultStatus={status as any}>
              <Button size="sm" variant="ghost">
                <Plus className="w-4 h-4" />
              </Button>
            </CreateTaskDialog>
          </div>

          <div className="space-y-3">
            {getTasksByStatus(status).map((task) => (
              <Card
                key={task.id}
                className="cursor-move hover:shadow-md transition-shadow"
                draggable
                onDragStart={() => handleDragStart(task.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{task.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {task.description && <p className="text-xs text-gray-600 mb-2">{task.description}</p>}
                  {task.assignee_email && (
                    <Badge variant="outline" className="text-xs">
                      {task.assignee_email}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
