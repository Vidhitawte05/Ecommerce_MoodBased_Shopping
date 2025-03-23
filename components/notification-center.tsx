"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { useNotifications } from "@/contexts/NotificationContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NotificationCenter() {
  const { notifications, markAsRead, markAllAsRead, removeNotification, clearAll, unreadCount } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleMarkAsRead = (id: string) => {
    markAsRead(id)
  }

  const handleRemove = (id: string) => {
    removeNotification(id)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return "✅"
      case "error":
        return "❌"
      case "warning":
        return "⚠️"
      default:
        return "ℹ️"
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" onClick={handleOpen} aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-[70vh] overflow-y-auto">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {notifications.length > 0 && (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={markAllAsRead}>
                Mark all as read
              </Button>
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={clearAll}>
                Clear all
              </Button>
            </div>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="py-4 text-center text-muted-foreground">No notifications</div>
        ) : (
          notifications.map((notification) => (
            <div key={notification.id}>
              <DropdownMenuItem className={`flex flex-col items-start p-3 ${!notification.read ? "bg-muted/50" : ""}`}>
                <div className="flex justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span>{getNotificationIcon(notification.type)}</span>
                    <span className="font-medium">{notification.title}</span>
                  </div>
                  <div className="flex gap-1">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        ✓
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleRemove(notification.id)}
                    >
                      ×
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                <div className="text-xs text-muted-foreground mt-2">{formatDate(notification.createdAt)}</div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </div>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

