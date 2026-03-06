"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";

import ProtectedLayout from "@/components/auth/ProtectedLayout";
import WorkspaceHeader from "@/components/layout/WorkspaceHeader";
import { Button } from "@/components/ui/button";
import { hasPermission } from "@/lib/auth/permissions";
import { Crumb } from "@/lib/types/Crumb";
import { isValidId } from "@/lib/utils/id";
import { useBoardsControllerFindOne } from "@/lib/api/generated/boards/boards";

export default function BoardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams<{ id?: string | string[] }>();
  const rawBoardId = Array.isArray(params.id) ? params.id[0] : params.id;

  const hasValidBoardId = isValidId(rawBoardId);
  if (!hasValidBoardId) {
    notFound();
  }

  const boardId = Number(rawBoardId);
  const boardQuery = useBoardsControllerFindOne(boardId);

  if (boardQuery.data?.status === 404) {
    notFound();
  }

  let boardName = "Board";
  if (boardQuery.isPending) {
    boardName = "Loading...";
  } else if (boardQuery.data?.status === 200) {
    boardName = boardQuery.data.data.name;
  }

  const crumbs: Crumb[] = [
    { title: "Boards", href: "/boards" },
    { title: boardName },
  ];

  return (
    // ProtectedLayout returns user, isLoggingOut and logout. To prevent duplication in each layout
    <ProtectedLayout
      requiredPermission="board_read_full_board"
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
