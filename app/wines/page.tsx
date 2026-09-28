import { redirect } from "next/navigation";
import { getLocale, localizeHref } from "@/lib/i18n";

export default async function Wines(){
  const locale = await getLocale();
  redirect(localizeHref("/catalogue", locale));
}
