"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getBoardsControllerFindMyBoardsQueryKey,
  useBoardsControllerRemove,
} from "@/lib/api/generated/boards/boards";
import { getErrorMessageByStatus } from "@/lib/errors/api-error";

type UseRemoveBoardMutationParams = {
  onSuccess?: () => void;
};

export function useRemoveBoardMutation({
  onSuccess,
}: UseRemoveBoardMutationParams = {}) {
  const queryClient = useQueryClient();
  const myBoardsQueryKey = getBoardsControllerFindMyBoardsQueryKey();

  return useBoardsControllerRemove({
    mutation: {
      onSuccess: (res) => {
        if (res.status === 200) {
          toast.success("Board deleted.");
          queryClient.invalidateQueries({ queryKey: myBoardsQueryKey });
          onSuccess?.();
          return;
        }

        toast.error(
          getErrorMessageByStatus(res.status, {
            403: "You do not have permission to delete this board.",
            404: "Board not found.",
          }),
        );
      },
      onError: () => {
        toast.error("Something went wrong. Please try again.");
      },
    },
  });
}
