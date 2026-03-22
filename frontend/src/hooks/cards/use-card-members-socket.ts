"use client";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Socket } from "socket.io-client";
import { getCardMembersControllerFindCardMembersQueryKey } from "@/lib/api/generated/card-members/card-members";
import { createAuthenticatedSocket } from "@/lib/utils/socket";

export function useCardMembersSocket(
  boardId: number,
  cardId: number,
  enabled = true,
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!enabled || !apiUrl) return;

    let socket: Socket;
    let cancelled = false;

    const refresh = () => {
      queryClient.invalidateQueries({
        queryKey: getCardMembersControllerFindCardMembersQueryKey(
          boardId,
          cardId,
        ),
      });
    };

    createAuthenticatedSocket(apiUrl).then((s) => {
      if (!s || cancelled) {
        s?.disconnect();
        return;
      }
      socket = s;

      const joinRooms = () => {
        socket.emit("board:join", { boardId });
        socket.emit("card:join", { cardId });
      };

      socket.on("connect", joinRooms);
      if (socket.connected) joinRooms();

      socket.on("card:memberAdded", refresh);
      socket.on("card:memberRemoved", refresh);
    });

    return () => {
      cancelled = true;
      socket?.off("connect");
      socket?.off("card:memberAdded", refresh);
      socket?.off("card:memberRemoved", refresh);
      if (socket?.connected) {
        socket.emit("card:leave", { cardId });
        socket.emit("board:leave", { boardId });
      }
      socket?.disconnect();
    };
  }, [boardId, cardId, enabled, queryClient]);
}
