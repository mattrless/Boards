"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { getListsControllerFindAllQueryKey } from "@/lib/api/generated/lists/lists";

export function useListsChangedSocket(boardId: number) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return;

    const socket = io(apiUrl, {
      withCredentials: true,
    });

    const refresh = () => {
      queryClient.invalidateQueries({
        queryKey: getListsControllerFindAllQueryKey(boardId),
      });
    };

    socket.on("connect", () => {
      socket.emit("board:join", { boardId });
    });

    socket.on("list:created", refresh);
    socket.on("list:deleted", refresh);
    socket.on("list:updated", refresh);
    socket.on("list:moved", refresh);

    return () => {
      socket.off("connect");
      socket.off("list:created", refresh);
      socket.off("list:deleted", refresh);
      socket.off("list:updated", refresh);
      socket.off("list:moved", refresh);
      if (socket.connected) {
        socket.emit("board:leave", { boardId });
      }
      socket.disconnect();
    };
  }, [boardId, queryClient]);
}
