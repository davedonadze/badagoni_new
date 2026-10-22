export const SITE_SETTINGS_SLUG = "site-settings";

export type SiteSettingsContent = {
  // Hides the EN/ქართული switcher (footer + age gate) while Georgian
  // translations are still incomplete - direct /ka/... URLs still work,
  // this just stops surfacing the option to switch.
  hideGeorgianLanguage: boolean;
};

export const SITE_SETTINGS_DEFAULT: SiteSettingsContent = {
  hideGeorgianLanguage: false,
};
