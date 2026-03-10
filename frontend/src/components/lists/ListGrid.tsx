import { DragDropProvider } from "@dnd-kit/react";
import ListCard from "./ListCard";
import { ListSummaryResponseDto } from "@/lib/api/generated/boardsAPI.schemas";
import CreateListCard from "./CreateListCard";
import { useBoardsControllerFindMyBoardPermissions } from "@/lib/api/generated/boards/boards";
import { hasBoardPermission } from "@/lib/auth/board-permissions";
import { useBoardIdParam } from "@/hooks/boards/use-board-id-param";
import { isSortable } from "@dnd-kit/react/sortable";
import { useUpdateListPositionMutation } from "@/hooks/lists/use-update-position-mutation";

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

  const updatePositionMutation = useUpdateListPositionMutation({
    boardId,
  });

  return (
    <DragDropProvider
      onBeforeDragStart={(event) => {
        if (!hasBoardPermission(userBoardPermissions, "list_update")) {
          event.preventDefault();
        }
      }}
      onDragEnd={(event) => {
        // In case the element its dropped in a no droppeable element
        if (event.canceled) return;

        const { source, target } = event.operation;
        if (isSortable(source) && isSortable(target)) {
          // Do nothing if is placed in the same spot
          if (source.initialIndex === source.index) return;

          const nextOrder = [...lists];
          const sourceIndex = nextOrder.findIndex(
            (list) => list.id === source.id,
          );

          if (sourceIndex === -1) return;

          const [moved] = nextOrder.splice(sourceIndex, 1);
          nextOrder.splice(target.index, 0, moved);

          const prevId = nextOrder[target.index - 1]?.id ?? null;
          const nextId = nextOrder[target.index + 1]?.id ?? null;

          if (!prevId && !nextId) return;

          let data;
          if (prevId && nextId) {
            data = { prevListId: prevId, nextListId: nextId };
          } else if (prevId) {
            data = { prevListId: prevId };
          } else {
            data = { nextListId: nextId };
          }

          updatePositionMutation.mutate({
            boardId,
            listId: Number(source.id),
            data,
          });
        }
      }}
    >
      <div className="w-full overflow-x-auto">
        <div className="flex w-max items-start gap-4">
          {lists.map((list, index) => (
            <ListCard list={list} index={index} key={list.id} />
          ))}

          {hasBoardPermission(userBoardPermissions, "list_create") ? (
            <CreateListCard />
          ) : null}
        </div>
      </div>
    </DragDropProvider>
  );
}
