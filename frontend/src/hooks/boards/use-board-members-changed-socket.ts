"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import {
  getBoardMembersControllerFindBoardMembersQueryKey,
} from "@/lib/api/generated/board-members/board-members";
import {
  getBoardsControllerFindMyBoardPermissionsQueryKey,
  getBoardsControllerFindOneQueryKey,
} from "@/lib/api/generated/boards/boards";

export function useBoardMembersChangedSocket(boardId: number) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return;

    const socket = io(apiUrl, {
      withCredentials: true,
    });

    const refresh = () => {
      queryClient.invalidateQueries({
        queryKey: getBoardMembersControllerFindBoardMembersQueryKey(boardId),
      });
      queryClient.invalidateQueries({
        queryKey: getBoardsControllerFindOneQueryKey(boardId),
      });
      queryClient.invalidateQueries({
        queryKey: getBoardsControllerFindMyBoardPermissionsQueryKey(boardId),
      });
    };

    socket.on("connect", () => {
      socket.emit("board:join", { boardId });
    });

    socket.on("board:memberAdded", refresh);
    socket.on("board:memberRemoved", refresh);
    socket.on("board:memberRoleUpdated", refresh);
    socket.on("board:ownershipTransferred", refresh);

    return () => {
      socket.off("connect");
      socket.off("board:memberAdded", refresh);
      socket.off("board:memberRemoved", refresh);
      socket.off("board:memberRoleUpdated", refresh);
      socket.off("board:ownershipTransferred", refresh);
      if (socket.connected) {
        socket.emit("board:leave", { boardId });
      }
      socket.disconnect();
    };
  }, [boardId, queryClient]);
}
