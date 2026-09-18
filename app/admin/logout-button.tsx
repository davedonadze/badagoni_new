"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return <Button type="button" variant="outline" size="sm" onClick={handleLogout} disabled={pending}>
    <LogOut />
    {pending ? "Signing out…" : "Sign out"}
  </Button>;
}
