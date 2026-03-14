"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { getCardMembersControllerFindCardMembersQueryKey } from "@/lib/api/generated/card-members/card-members";

export function useCardMembersSocket(boardId: number, cardId: number) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return;

    const socket = io(apiUrl, {
      withCredentials: true,
    });

    const refresh = () => {
      queryClient.invalidateQueries({
        queryKey: getCardMembersControllerFindCardMembersQueryKey(
          boardId,
          cardId,
        ),
      });
    };

    socket.on("connect", () => {
      socket.emit("card:join", { cardId });
    });

    socket.on("card:memberAdded", refresh);
    socket.on("card:memberRemoved", refresh);

    return () => {
      socket.off("connect");
      socket.off("card:memberAdded", refresh);
      socket.off("card:memberRemoved", refresh);
      if (socket.connected) {
        socket.emit("card:leave", { cardId });
      }
      socket.disconnect();
    };
  }, [boardId, cardId, queryClient]);
}
