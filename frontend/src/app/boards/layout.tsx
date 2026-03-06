"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import ProtectedLayout from "@/components/auth/ProtectedLayout";
import WorkspaceHeader from "@/components/layout/WorkspaceHeader";
import { Button } from "@/components/ui/button";
import { hasPermission } from "@/lib/auth/permissions";
import { Crumb } from "@/lib/types/Crumb";

export default function BoardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isBoardDetailsRoute = /^\/boards\/[^/]+$/.test(pathname);

  if (isBoardDetailsRoute) {
    return <>{children}</>;
  }

  const crumbs: Crumb[] = [{ title: "Boards" }];

  return (
    // ProtectedLayout returns user, isLoggingOut and logout. To prevent duplication in each layout
    <ProtectedLayout
      requiredPermission="board_read"
      forbiddenRedirectTo="/forbidden"
    >
      {({ user, isLoggingOut, logout }) => (
        <main className="min-h-screen bg-muted/20 p-4 md:p-6">
          <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
            <WorkspaceHeader
              userName={user.profile.name}
              crumbs={crumbs}
              isLoggingOut={isLoggingOut}
              onLogout={logout}
              actions={
                hasPermission(user, "user_create") ? (
                  <Button asChild variant="secondary">
                    <Link href="/admin/users">Users</Link>
                  </Button>
                ) : null
              }
            />
            {children}
          </section>
        </main>
      )}
    </ProtectedLayout>
  );
}
