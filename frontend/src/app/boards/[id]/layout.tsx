"use client";

import { useCallback } from "react";
import { notFound, useRouter } from "next/navigation";
import BoardsWorkspaceLayoutShell from "@/components/layout/BoardsWorkspaceLayoutShell";
import BoardSettingsDialog from "@/components/boards/BoardSettingsDialog";
import BoardLayoutSkeleton from "@/components/skeletons/BoardLayoutSkeleton";
import BoardPageSkeleton from "@/components/skeletons/BoardPageSkeleton";
import { Crumb } from "@/lib/types/Crumb";
import {
  useBoardsControllerFindMyBoardPermissions,
  useBoardsControllerFindOne,
} from "@/lib/api/generated/boards/boards";
import { useBoardIdParam } from "@/hooks/boards/use-board-id-param";
import { useBoardsChangedSocket } from "@/hooks/boards/use-boards-changed-socket";
import { useBoardMembersChangedSocket } from "@/hooks/boards/use-board-members-changed-socket";
import { hasAnyBoardPermission } from "@/lib/auth/board-permissions";

export default function BoardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const boardId = useBoardIdParam();
  const router = useRouter();
  const boardQuery = useBoardsControllerFindOne(boardId);
  const permissionsQuery = useBoardsControllerFindMyBoardPermissions(boardId);
  const isBoardLayoutPending = boardQuery.isPending || permissionsQuery.isPending;

  const handleBoardDeleted = useCallback(() => {
    router.replace("/boards");
  }, [router]);

  useBoardsChangedSocket({
    currentBoardId: boardId,
    onBoardDeleted: handleBoardDeleted,
  });
  useBoardMembersChangedSocket(boardId);

  if (boardQuery.data?.status === 404) {
    notFound();
  }

  const boardName =
    boardQuery.data?.status === 200 ? boardQuery.data.data.name : "Board";

  const board = boardQuery.data?.data;

  const crumbs: Crumb[] = [
    { title: "Boards", href: "/boards" },
    { title: boardName },
  ];

  const boardPermissions =
    permissionsQuery.data?.status === 200
      ? permissionsQuery.data.data.permissions
      : undefined;

  const canSeeSettings = hasAnyBoardPermission(boardPermissions, [
    "board_update",
    "board_delete",
    "board_add_members",
    "board_remove_members",
    "board_update_member_role",
  ]);

  const boardActions = isBoardLayoutPending
    ? <BoardLayoutSkeleton />
    : canSeeSettings && board
      ? <BoardSettingsDialog board={board} />
      : null;

  return (
    <BoardsWorkspaceLayoutShell
      requiredPermission="board_read_full_board"
      crumbs={crumbs}
      boardActions={boardActions}
    >
      {isBoardLayoutPending ? <BoardPageSkeleton /> : children}
    </BoardsWorkspaceLayoutShell>
  );
}
