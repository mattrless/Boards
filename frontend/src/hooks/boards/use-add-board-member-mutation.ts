import { getBoardMembersControllerFindBoardMembersQueryKey } from "./../../lib/api/generated/board-members/board-members";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getErrorMessageByStatus } from "@/lib/errors/api-error";
import { useBoardMembersControllerAddMember } from "@/lib/api/generated/board-members/board-members";

type UseUpdateBoardMutationParams = {
  boardId: number;
  onSuccess?: () => void;
  onErrorMessage?: (message: string) => void;
};

export function useAddBoardMemberMutation({
  boardId,
  onSuccess,
  onErrorMessage,
}: UseUpdateBoardMutationParams) {
  const queryClient = useQueryClient();

  return useBoardMembersControllerAddMember({
    mutation: {
      onSuccess: (res) => {
        if (res.status === 201) {
          toast.success("Member added");
          queryClient.invalidateQueries({
            queryKey:
              getBoardMembersControllerFindBoardMembersQueryKey(boardId),
          });
          onSuccess?.();
          return;
        }

        onErrorMessage?.(
          getErrorMessageByStatus(res.status, {
            400: "Invalid email",
            403: "You do not have permission to add members.",
            404: "User not found.",
          }),
        );
      },
      onError: () => {
        const message = "Something went wrong. Please try again.";
        toast.error(message);
        onErrorMessage?.(message);
      },
    },
  });
}
