import { getPageContent } from "@/lib/pages/service";
import { SITE_SETTINGS_SLUG, SITE_SETTINGS_DEFAULT, type SiteSettingsContent } from "@/lib/pages/site-settings";
import { SettingsForm } from "./settings-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const content = (await getPageContent<SiteSettingsContent>(SITE_SETTINGS_SLUG)) ?? SITE_SETTINGS_DEFAULT;

  return <div className="flex flex-col gap-6">
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Sitewide options that aren’t tied to a specific page.</p>
    </div>
    <SettingsForm content={content} />
  </div>;
}
