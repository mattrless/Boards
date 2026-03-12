import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CardSummaryResponseDto,
  ListSummaryResponseDto,
} from "@/lib/api/generated/boardsAPI.schemas";
import { useBoardsControllerFindMyBoardPermissions } from "@/lib/api/generated/boards/boards";
import { useBoardIdParam } from "@/hooks/boards/use-board-id-param";
import {
  hasAllBoardPermissions,
  hasBoardPermission,
} from "@/lib/auth/board-permissions";
import EntityActions from "../common/EntityActions";
import { useState } from "react";
import { useRemoveListMutation } from "@/hooks/lists/use-remove-list-mutation";
import ListEditForm from "./ListEditForm";
import { useUpdateListMutation } from "@/hooks/lists/use-update-list-mutation";
import { useSortable } from "@dnd-kit/react/sortable";
import { cn } from "@/lib/utils";
import CardItem from "../cards/CardItem";
import CreateCardButton from "../cards/CreateCardButton";
import { CollisionPriority } from "@dnd-kit/abstract";
import { useCardsControllerFindAll } from "@/lib/api/generated/cards/cards";
import { useDroppable } from "@dnd-kit/react";
import EmptyListDroppable from "../cards/EmptyListDroppable";

export default function ListCard({
  list,
  index,
}: {
  list: ListSummaryResponseDto;
  index: number;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const boardId = useBoardIdParam();
  const userBoardInfoQuery = useBoardsControllerFindMyBoardPermissions(boardId);
  const removeListMutation = useRemoveListMutation(boardId);
  const updateListMutation = useUpdateListMutation({
    boardId,
    onSuccess: () => {
      setIsEditing(false);
      setEditError(null);
    },
    onErrorMessage: (message) => {
      setEditError(message);
    },
  });
  const userBoardInfo =
    userBoardInfoQuery.data?.status === 200
      ? userBoardInfoQuery.data.data
      : undefined;

  const userBoardPermissions = userBoardInfo?.permissions;

  const isMutating =
    removeListMutation.isPending || updateListMutation.isPending;

  const { isDragging, ref } = useSortable({
    id: `list-${list.id}`,
    index,
    type: "list",
    accept: ["list"],
    collisionPriority: CollisionPriority.Low,
  });

  const { data } = useCardsControllerFindAll(boardId, list.id);
  if (data?.status !== 200) return <div>Error</div>;
  const cardItems: CardSummaryResponseDto[] = data?.data;

  function handleDelete() {
    removeListMutation.mutate({ boardId, listId: list.id });
  }

  function handleRenameList(nextTitle: string) {
    setEditError(null);
    if (nextTitle === list.title) {
      setIsEditing(false);
      return;
    }

    updateListMutation.mutate({
      boardId,
      listId: list.id,
      data: { title: nextTitle },
    });
  }

  function handleCancelEdit() {
    setEditError(null);
    setIsEditing(false);
  }

  function handleStartEdit() {
    setEditError(null);
    setIsEditing(true);
  }

  return (
    <div ref={ref}>
      <Card
        className={cn(
          "w-72 shrink-0 self-start overflow-hidden gap-0 pt-4 pb-2 max-h-[calc(100dvh-9rem)]",
          isDragging && "opacity-70",
        )}
      >
        <CardHeader className="px-4">
          {isEditing ? (
            <ListEditForm
              initialTitle={list.title}
              isPending={isMutating}
              submitError={editError}
              onCancel={handleCancelEdit}
              onSubmitName={handleRenameList}
            />
          ) : (
            <>
              <CardTitle className="line-clamp-1 leading-tight">
                {list.title + "  " + list.id}
              </CardTitle>
              <CardAction>
                {hasAllBoardPermissions(userBoardPermissions, [
                  "list_update",
                  "list_delete",
                ]) ? (
                  <EntityActions
                    entityLabel="List"
                    entityName={list.title}
                    disabled={isMutating}
                    onEdit={handleStartEdit}
                    onDelete={handleDelete}
                  />
                ) : null}
              </CardAction>
            </>
          )}
        </CardHeader>
        <CardContent
          className="scrollbar-hidden px-4 flex min-h-0 flex-col gap-2 overflow-y-auto"
          key={`cards-${list.id}-${cardItems.map((c) => c.id).join("-")}`}
        >
          {cardItems.length === 0 ? (
            <EmptyListDroppable listId={list.id} />
          ) : (
            cardItems.map((item, index) => (
              <CardItem
                key={item.id}
                item={item}
                index={index}
                listId={list.id}
              />
            ))
          )}
        </CardContent>

        {hasBoardPermission(userBoardPermissions, "card_create") ? (
          <CardFooter className="pt-2 px-4">
            <CreateCardButton boardId={boardId} listId={list.id} />
          </CardFooter>
        ) : null}
      </Card>
    </div>
  );
}
