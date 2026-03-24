'use client';

import { Home, MessageCircleMore, LayoutDashboard } from 'lucide-react'
import { NavBar } from "@/components/ui/tubelight-navbar"

export function NavBarDemo() {
  const navItems = [
    { name: 'Home', url: '/main', icon: Home },
    { name: 'GroupChat', url: '#groupchat', icon: MessageCircleMore },
    { name: 'Dashboard', url: '/dashboard', icon: LayoutDashboard }
  ]

  return <NavBar items={navItems} />
}
