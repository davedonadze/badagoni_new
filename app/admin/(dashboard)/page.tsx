import Link from "next/link";
import { Wine, ListTree, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { listWines } from "@/lib/wines/service";
import { listMenuItems } from "@/lib/menu/service";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [wines, menuItems] = await Promise.all([listWines(), listMenuItems()]);

  const stats = [
    { label: "Wines", value: wines.length, href: "/admin/wines", icon: Wine },
    { label: "Menu items", value: menuItems.length, href: "/admin/menu", icon: ListTree },
  ];

  return <div className="flex flex-col gap-8">
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">An overview of what's in the site right now.</p>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {stats.map(stat => <Link key={stat.href} href={stat.href}>
        <Card className="transition-colors hover:bg-accent/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
            <stat.icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{stat.value}</div>
          </CardContent>
        </Card>
      </Link>)}
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
        <CardDescription>Jump straight to adding something new.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Link href="/admin/wines/new" className="inline-flex items-center gap-1.5 text-sm underline underline-offset-4">
          Add a wine <ArrowUpRight className="size-3.5" />
        </Link>
        <Link href="/admin/menu/new" className="inline-flex items-center gap-1.5 text-sm underline underline-offset-4">
          Add a menu item <ArrowUpRight className="size-3.5" />
        </Link>
      </CardContent>
    </Card>
  </div>;
}
