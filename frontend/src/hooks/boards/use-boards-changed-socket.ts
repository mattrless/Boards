"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { getBoardsControllerFindMyBoardsQueryKey } from "@/lib/api/generated/boards/boards";

export function useBoardsChangedSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return;

    const socket = io(apiUrl, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      socket.emit("user:join");
    });

    socket.on("boards:changed", () => {
      queryClient.invalidateQueries({
        queryKey: getBoardsControllerFindMyBoardsQueryKey(),
      });
    });

    return () => {
      socket.off("connect");
      socket.off("boards:changed");
      socket.disconnect();
    };
  }, [queryClient]);
}
