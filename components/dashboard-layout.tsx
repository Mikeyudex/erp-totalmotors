"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Box, Home, Package, Settings, Truck, Users, Tag } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 px-2">
            {/* <Box className="h-6 w-6 flex-shrink-0" /> */}
            <img src="/Logo-DOF1-768x552.png" alt="logo" className="h-6 w-8 group-data-[collapsible=icon]:hidden" />
            <span className="text-lg font-bold group-data-[collapsible=icon]:hidden">ERP TotalMotors</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/"} tooltip="Dashboard">
                <Link href="/">
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith("/productos")} tooltip="Productos">
                <Link href="/productos">
                  <Package className="h-4 w-4" />
                  <span>Productos</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith("/categorias")} tooltip="Categorías">
                <Link href="/categorias">
                  <Tag className="h-4 w-4" />
                  <span>Categorías</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith("/vehiculos")} tooltip="Vehículos">
                <Link href="/vehiculos">
                  <Truck className="h-4 w-4" />
                  <span>Vehículos</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith("/usuarios")} tooltip="Usuarios">
                <Link href="/usuarios">
                  <Users className="h-4 w-4" />
                  <span>Usuarios</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith("/configuracion")} tooltip="Configuración">
                <Link href="/configuracion">
                  <Settings className="h-4 w-4" />
                  <span>Configuración</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <div className="flex items-center justify-center group-data-[collapsible=icon]:px-0">
            <ModeToggle />
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <SidebarTrigger />
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              Mi Cuenta
            </Button>
            <Button variant="outline" size="icon" className="sm:hidden">
              <Users className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <div className="flex-1 overflow-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
