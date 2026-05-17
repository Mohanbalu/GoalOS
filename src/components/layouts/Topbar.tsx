"use client"

import * as React from "react"
import { Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { signOut } from "next-auth/react"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Sidebar } from "./Sidebar"
import { NotificationCenter } from "@/components/shared/NotificationCenter"
import { CommandPalette } from "@/components/shared/CommandPalette"

interface TopbarProps {
  user: {
    name?: string | null
    email?: string | null
    role?: string | null
  }
}

export function Topbar({ user }: TopbarProps) {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const role = (user.role || "EMPLOYEE") as "ADMIN" | "MANAGER" | "EMPLOYEE"
  
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "U"

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 sm:px-8 shadow-sm">
      <CommandPalette open={isSearchOpen} setOpen={setIsSearchOpen} />
      
      <Sheet>
        <SheetTrigger 
          render={
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          }
        />
        <SheetContent side="left" className="p-0 w-64">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <Sidebar role={role} isMobile />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex justify-center">
        <div 
          className="command-search-container group cursor-pointer hover:bg-muted/50 transition-all w-full max-w-xl"
          onClick={() => setIsSearchOpen(true)}
        >
          <Search className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          <div className="flex-1 text-sm text-muted-foreground/60 font-medium px-3 truncate">
            Search objectives, audit records, departments, or personnel...
          </div>
          <div className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded border border-border/50 bg-muted/80 text-[10px] font-bold text-muted-foreground group-hover:border-primary/20 group-hover:text-primary transition-all">
            <span className="text-[8px]">⌘</span>K
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <NotificationCenter />
        
        <div className="h-8 w-[1px] bg-border/50 mx-1 hidden sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger 
            render={
              <Button variant="ghost" className="relative h-10 gap-3 px-2 hover:bg-muted/50 rounded-full sm:rounded-lg">
                <Avatar className="h-8 w-8 border border-border/50">
                  <AvatarFallback className="bg-primary/5 text-primary font-bold text-xs">{initials}</AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start leading-none gap-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{user?.name}</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-primary/70">{role} Authority</span>
                </div>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-56 p-2 border border-border/50 shadow-2xl">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-2 py-3">
                <div className="flex flex-col space-y-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{user?.name}</p>
                  <p className="text-[10px] font-medium text-muted-foreground truncate">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="py-1">
              <DropdownMenuItem className="cursor-pointer gap-2 py-2 px-3 text-xs font-medium">
                Security Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2 py-2 px-3 text-xs font-medium">
                Governance Support
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:bg-destructive/10 cursor-pointer font-bold text-xs py-2.5 px-3 uppercase tracking-widest" 
              onClick={() => signOut()}
            >
              Terminate Session
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
