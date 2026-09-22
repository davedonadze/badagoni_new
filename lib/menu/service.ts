import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { menuItems, type Localized } from "@/db/schema";

export type MenuLocation = "header_primary" | "header_secondary" | "footer";

export type MenuItem = {
  id: number;
  label: Localized;
  href: string;
  location: MenuLocation;
  order: number;
};

export type MenuItemInput = {
  label: Localized;
  href: string;
  location: MenuLocation;
  order: number;
};

export function validateMenuItemInput(input: Partial<MenuItemInput>): string | null {
  if (!input.label?.en?.trim()) return "An English label is required.";
  if (!input.href?.trim()) return "A link is required.";
  if (!input.location) return "A location is required.";
  return null;
}

export async function listMenuItems(): Promise<MenuItem[]> {
  const db = getDb();
  return db.select().from(menuItems).orderBy(asc(menuItems.location), asc(menuItems.order));
}

export async function getMenuItem(id: number): Promise<MenuItem | undefined> {
  const db = getDb();
  const [item] = await db.select().from(menuItems).where(eq(menuItems.id, id)).limit(1);
  return item;
}

export async function createMenuItem(input: MenuItemInput): Promise<MenuItem> {
  const db = getDb();
  const [item] = await db
    .insert(menuItems)
    .values({
      label: input.label,
      href: input.href,
      location: input.location,
      order: input.order,
    })
    .returning();
  return item;
}

export async function updateMenuItem(id: number, input: MenuItemInput): Promise<MenuItem | undefined> {
  const db = getDb();
  const [item] = await db
    .update(menuItems)
    .set({
      label: input.label,
      href: input.href,
      location: input.location,
      order: input.order,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(menuItems.id, id))
    .returning();
  return item;
}

export async function deleteMenuItem(id: number): Promise<boolean> {
  const db = getDb();
  const deleted = await db.delete(menuItems).where(eq(menuItems.id, id)).returning({ id: menuItems.id });
  return deleted.length > 0;
}
