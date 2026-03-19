"use client";

import ListGrid from "@/components/lists/ListGrid";
import BoardPageSkeleton from "@/components/skeletons/BoardPageSkeleton";
import { useBoardIdParam } from "@/hooks/boards/use-board-id-param";
import { useCardsChangedSocket } from "@/hooks/cards/use-cards-changed-socket";
import { useListsChangedSocket } from "@/hooks/lists/use-lists-changed-socket";
import { ListSummaryResponseDto } from "@/lib/api/generated/boardsAPI.schemas";
import { useListsControllerFindAll } from "@/lib/api/generated/lists/lists";

export default function BoardPage() {
  const boardId = useBoardIdParam();

  const { data, isPending } = useListsControllerFindAll(boardId);
  useListsChangedSocket(boardId);
  useCardsChangedSocket(boardId);

  if (isPending || !data) return <BoardPageSkeleton />;
  if (data.status !== 200) return <BoardPageSkeleton />;

  const lists: ListSummaryResponseDto[] = data.data;

  return (
    <>
      <ListGrid lists={lists} />
    </>
  );
}
