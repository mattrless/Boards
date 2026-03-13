"use client";

import { Button } from "@/components/ui/button";
import { getBoardMembersControllerFindBoardMembersQueryKey } from "@/lib/api/generated/board-members/board-members";
import {
  getBoardsControllerFindOneQueryKey,
  useBoardsControllerTransferOwnership,
} from "@/lib/api/generated/boards/boards";
import { BoardMemberActionButtonProps } from "@/lib/types/board-member-action-button";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function TransferOwnershipButton({
  boardId,
  member,
  disabled,
}: BoardMemberActionButtonProps) {
  const targetRole = member.boardRole.name === "admin" ? "member" : "admin";
  const queryClient = useQueryClient();
  const makeOwnerQuery = useBoardsControllerTransferOwnership({
    mutation: {
      onSuccess: (res) => {
        if (res.status === 200) {
          toast.success("Owner updated");
          queryClient.invalidateQueries({
            queryKey: getBoardsControllerFindOneQueryKey(boardId),
          });
          queryClient.invalidateQueries({
            queryKey:
              getBoardMembersControllerFindBoardMembersQueryKey(boardId),
          });
          return;
        }
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    },
  });

  const handleClick = () => {
    const targetUserId = member.user.id;
    makeOwnerQuery.mutate({
      boardId,
      targetUserId,
    });
  };
  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      disabled={disabled}
      onClick={handleClick}
      aria-label={`Transfer ownership to ${member.user.profile?.name ?? member.user.email}`}
    >
      Make owner
    </Button>
  );
}
