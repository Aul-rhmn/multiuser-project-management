"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface Member {
  id: string
  email: string
  is_owner: boolean
}

interface MembersListProps {
  members: Member[]
  projectId: string
  isOwner: boolean
}

export function MembersList({ members, projectId, isOwner }: MembersListProps) {
  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return

    try {
      const response = await fetch(`/api/projects/${projectId}/members/${memberId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error("Failed to remove member:", error)
    }
  }

  return (
    <div className="space-y-3">
      {members.map((member) => (
        <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            <div>
              <p className="font-medium">{member.email}</p>
              {member.is_owner && (
                <Badge variant="secondary" className="text-xs">
                  Owner
                </Badge>
              )}
            </div>
          </div>
          {isOwner && !member.is_owner && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveMember(member.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  )
}
