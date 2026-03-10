import { useDraggable } from "@dnd-kit/react";
import ListCard from "./ListCard";
import { ListSummaryResponseDto } from "@/lib/api/generated/boardsAPI.schemas";
import CreateListCard from "./CreateListCard";
import { useBoardsControllerFindMyBoardPermissions } from "@/lib/api/generated/boards/boards";
import { hasBoardPermission } from "@/lib/auth/board-permissions";
import { useBoardIdParam } from "@/hooks/boards/use-board-id-param";

export default function ListGrid({
  lists,
}: {
  lists: ListSummaryResponseDto[];
}) {
  const boardId = useBoardIdParam();
  const userBoardInfoQuery = useBoardsControllerFindMyBoardPermissions(boardId);
  const userBoardInfo =
    userBoardInfoQuery.data?.status === 200
      ? userBoardInfoQuery.data.data
      : undefined;

  const userBoardPermissions = userBoardInfo?.permissions;

  const { ref } = useDraggable({
    id: "draggable",
  });

  return (
    <div className="w-full overflow-x-auto" data-list-grid-scroll>
      <div className="flex w-max items-start gap-4">
        {lists.map((list) => (
          <ListCard list={list} key={list.id} />
        ))}

        {hasBoardPermission(userBoardPermissions, "list_create") ? (
          <CreateListCard />
        ) : null}
      </div>
    </div>
  );
}
