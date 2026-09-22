import { AdminLoginForm } from "@/components/AdminLoginForm";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getLocale } from "@/lib/i18n/server";

export default async function AdminLoginPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  return <AdminLoginForm dict={dict} />;
}
