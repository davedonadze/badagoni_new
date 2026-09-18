"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wine, ListTree, FileText, Newspaper } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { LogoutButton } from "./logout-button";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/wines", label: "Wines", icon: Wine },
  { href: "/admin/menu", label: "Menu", icon: ListTree },
  { href: "/admin/pages", label: "Pages", icon: FileText, comingSoon: true },
  { href: "/admin/news", label: "News", icon: Newspaper, comingSoon: true },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return <SidebarProvider className="admin-shell">
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-3">
        <Link href="/admin" className="flex items-center gap-2 px-1 text-sm font-semibold tracking-tight">
          <img src="/images/badagoni-logo.svg" alt="" width={20} height={20} className="shrink-0 opacity-80" />
          <span className="group-data-[collapsible=icon]:hidden">Badagoni admin</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map(item => {
                const isActive = item.exact ? path === item.href : path.startsWith(item.href);
                return <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive} disabled={item.comingSoon} tooltip={item.comingSoon ? `${item.label} — coming soon` : item.label}>
                    {item.comingSoon
                      ? <span className="cursor-default opacity-50"><item.icon />{item.label}</span>
                      : <Link href={item.href}><item.icon />{item.label}</Link>}
                  </SidebarMenuButton>
                  {item.comingSoon && <SidebarMenuBadge className="text-[10px] opacity-60">soon</SidebarMenuBadge>}
                </SidebarMenuItem>;
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-3 pb-3">
        <Separator className="mb-3" />
        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
    <SidebarInset>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
      </header>
      <div className="flex-1 p-6">{children}</div>
    </SidebarInset>
  </SidebarProvider>;
}
