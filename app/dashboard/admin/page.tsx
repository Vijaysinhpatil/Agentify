import { redirect } from "next/navigation";

import AdminDashboardClient from "./AdminDashboardClient";
import { getCurrentUserAdminState } from "@/lib/admin";

export default async function AdminPage() {
  const { isSignedIn, isAdmin } = await getCurrentUserAdminState();

  if (!isSignedIn) {
    redirect("/sign-in");
  }

  if (!isAdmin) {
    redirect("/dashboard");
  }

  return <AdminDashboardClient />;
}
