"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getListsControllerFindAllQueryKey,
  useListsControllerUpdatePosition,
} from "@/lib/api/generated/lists/lists";

type UseUpdateListPositionMutationParams = {
  boardId: number;
};

export function useUpdateListPositionMutation({
  boardId,
}: UseUpdateListPositionMutationParams) {
  const queryClient = useQueryClient();
  const listsQueryKey = getListsControllerFindAllQueryKey(boardId);

  return useListsControllerUpdatePosition({
    mutation: {
      onSuccess: async (res) => {
        if (res.status === 200) {
          toast.success("List position updated.");
          await queryClient.invalidateQueries({ queryKey: listsQueryKey });
        }
      },
      onError: () => {
        toast.error("Something went wrong. Please try again.");
      },
    },
  });
}
