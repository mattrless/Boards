import type { UniqueIdentifier } from "@dnd-kit/abstract";
import type {
  CardSummaryResponseDto,
  CardsPositionControllerUpdatePositionBody,
  ListsControllerUpdatePositionBody,
  ListSummaryResponseDto,
} from "@/lib/api/generated/boardsAPI.schemas";
import type { DragDropEvents } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";

function extractId(dndId: UniqueIdentifier | null | undefined) {
  if (dndId === null || dndId === undefined) return null;
  if (typeof dndId === "number") return dndId;
  const id = dndId.split("-").at(-1);
  if (!id) return null;
  const parsed = Number(id);
  return Number.isNaN(parsed) ? null : parsed;
}

type DragEndEvent = Parameters<DragDropEvents["dragend"]>[0];

type UpdateListPositionMutation = {
  mutate: (args: {
    boardId: number;
    listId: number;
    data: ListsControllerUpdatePositionBody;
  }) => void;
};

type UpdateCardPositionMutation = {
  mutate: (args: {
    boardId: number;
    cardId: number;
    data: CardsPositionControllerUpdatePositionBody;
  }) => void;
};

type HandleDragEndParams = {
  event: DragEndEvent;
  lists: ListSummaryResponseDto[];
  boardId: number;
  updateListPositionMutation: UpdateListPositionMutation;
  updateCardPositionMutation: UpdateCardPositionMutation;
  getCardsInList: (listId: number) => CardSummaryResponseDto[];
};

export default function onDragEnd({
  event,
  lists,
  boardId,
  updateListPositionMutation,
  updateCardPositionMutation,
  getCardsInList,
}: HandleDragEndParams) {
  if (event.canceled) return;

  const { source, target } = event.operation;
  const sourceType = source?.type;
  const targetType = target?.type;

  if (isSortable(source) && isSortable(target)) {
    if (sourceType === "list" && targetType === "list") {
      // Do nothing if is placed in the same spot
      if (source.initialIndex === source.index) return;
      const sourceId = extractId(source.id);
      if (sourceId === null) return;

      // Move list in new array to know prev and next list
      const nextOrder = [...lists];
      const sourceIndex = nextOrder.findIndex((list) => list.id === sourceId);
      if (sourceIndex === -1) return;

      const [moved] = nextOrder.splice(sourceIndex, 1);
      nextOrder.splice(target.index, 0, moved);

      const prevDndId = nextOrder[target.index - 1]?.id ?? null;
      const nextDndId = nextOrder[target.index + 1]?.id ?? null;

      const prevId = extractId(prevDndId) ?? undefined;
      const nextId = extractId(nextDndId) ?? undefined;

      if (!prevId && !nextId) return;

      let data: ListsControllerUpdatePositionBody;
      if (prevId && nextId) {
        data = { prevListId: prevId, nextListId: nextId };
      } else if (prevId) {
        data = { prevListId: prevId };
      } else {
        // nextId is defined here because prevId is falsy and we returned when both are falsy
        data = { nextListId: nextId as number };
      }

      updateListPositionMutation.mutate({
        boardId,
        listId: sourceId,
        data,
      });
    } else if (sourceType === "card" && targetType === "card") {
      const sourceDndInitialIndex = source.initialIndex;
      const sourceDndIndex = source.index;
      const targetDndIndex = target.index;
      const targetListId = Number(target.group);
      const sourceListId = Number(source.initialGroup);

      const sameList = sourceListId === targetListId;
      const samePosition = sourceDndInitialIndex === sourceDndIndex;

      if (sameList && samePosition) {
        return; // Do nothing if is placed in the same spot
      } else {
        const sourceId = extractId(source.id);
        if (sourceId === null) return;

        if (Number.isNaN(targetListId) || Number.isNaN(sourceListId)) {
          return;
        }

        const cardItems = getCardsInList(targetListId);

        const nextOrder = cardItems
          .map((card) => card.id)
          .filter((id) => id !== sourceId);

        const clampedIndex = Math.min(targetDndIndex, nextOrder.length);
        nextOrder.splice(clampedIndex, 0, sourceId);

        const newIndex = nextOrder.indexOf(sourceId);
        const prevId = nextOrder[newIndex - 1] ?? undefined;
        const nextId = nextOrder[newIndex + 1] ?? undefined;

        let data: CardsPositionControllerUpdatePositionBody;
        if (prevId && nextId) {
          data = {
            targetListId,
            prevCardId: prevId,
            nextCardId: nextId,
          };
        } else if (prevId) {
          data = { targetListId, prevCardId: prevId };
        } else if (!prevId && !nextId) {
          data = { targetListId };
        } else {
          // nextId is defined here because prevId is falsy and we returned when both are falsy
          data = { targetListId, nextCardId: nextId as number };
        }

        updateCardPositionMutation.mutate({
          boardId,
          cardId: sourceId,
          data,
        });
      }
    }
  }
}
