"use client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getCardsControllerFindAllQueryKey,
  useCardsControllerUpdate,
} from "@/lib/api/generated/cards/cards";

export function useUpdateCardMutation({
  boardId,
  listId,
}: {
  boardId: number;
  listId: number;
}) {
  const queryClient = useQueryClient();

  return useCardsControllerUpdate({
    mutation: {
      onSuccess: async (res) => {
        if (res.status === 200) {
          toast.success("Card information updated");

          // websockets invalidates but just in case
          queryClient.invalidateQueries({
            queryKey: getCardsControllerFindAllQueryKey(boardId, listId),
          });
        } else {
          toast.error("Could not update card. Please try again.");
        }
      },
    },
  });
}
