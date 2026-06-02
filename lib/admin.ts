import "server-only";

import { currentUser } from "@clerk/nextjs/server";

function getAdminEmailSet() {
  const raw = process.env.ADMIN_EMAILS ?? "";

  return new Set(
    raw
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

export async function isCurrentUserAdmin() {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase() ?? "";
  const adminEmails = getAdminEmailSet();

  return Boolean(email && adminEmails.has(email));
}

export async function getCurrentUserAdminState() {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase() ?? "";
  const adminEmails = getAdminEmailSet();

  return {
    isSignedIn: Boolean(user),
    isAdmin: Boolean(email && adminEmails.has(email)),
    email,
  };
}
