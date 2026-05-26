'use client'

import { MessageSquare } from 'lucide-react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}

export function EmptyState({ 
  icon = <MessageSquare className="w-12 h-12" />, 
  title, 
  description, 
  action 
}: EmptyStateProps) {
  return (
    <div className="glass rounded-xl p-12 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/50 text-muted-foreground mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">{description}</p>
      {action}
    </div>
  )
}
