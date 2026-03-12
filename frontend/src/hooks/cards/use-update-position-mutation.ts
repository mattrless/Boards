"use client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getCardsControllerFindAllQueryKey,
  useCardsPositionControllerUpdatePosition,
} from "@/lib/api/generated/cards/cards";

type UseUpdateCardPositionMutationParams = {
  boardId: number;
};

export function useUpdateCardPositionMutation({
  boardId,
}: UseUpdateCardPositionMutationParams) {
  const queryClient = useQueryClient();

  return useCardsPositionControllerUpdatePosition({
    mutation: {
      onSuccess: async (res) => {
        if (res.status === 200) {
          toast.success("Card position updated.");

          const targetListId = res.data.list.id;
          const sourceListId = res.data.sourceListId;

          await queryClient.invalidateQueries({
            queryKey: getCardsControllerFindAllQueryKey(boardId, targetListId),
          });
          if (targetListId !== sourceListId) {
            await queryClient.invalidateQueries({
              queryKey: getCardsControllerFindAllQueryKey(
                boardId,
                sourceListId,
              ),
            });
          }
        }
      },
    },
  });
}
