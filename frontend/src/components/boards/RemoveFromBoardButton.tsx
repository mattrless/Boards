"use client";

import { Button } from "@/components/ui/button";
import {
  getBoardMembersControllerFindBoardMembersQueryKey,
  useBoardMembersControllerRemoveMember,
} from "@/lib/api/generated/board-members/board-members";
import { getBoardsControllerFindOneQueryKey } from "@/lib/api/generated/boards/boards";
import { BoardMemberActionButtonProps } from "@/lib/types/board-member-action-button";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function RemoveFromBoardButton({
  boardId,
  member,
  disabled,
}: BoardMemberActionButtonProps) {
  const queryClient = useQueryClient();
  const removeMemberQuery = useBoardMembersControllerRemoveMember({
    mutation: {
      onSuccess: (res) => {
        if (res.status === 200) {
          toast.success("Member removed");
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
    removeMemberQuery.mutate({
      boardId,
      targetUserId,
    });
  };

  return (
    <Button
      type="button"
      size="sm"
      variant="destructive"
      disabled={disabled}
      onClick={handleClick}
      aria-label={`Remove ${member.user.profile?.name ?? member.user.email} from board`}
    >
      Remove
    </Button>
  );
}
