"use client";

import { useSortable } from "@dnd-kit/react/sortable";

export default function EmptyListDroppable({ listId }: { listId: number }) {
  const { ref } = useSortable({
    id: `card-empty-${listId}`,
    index: 0,
    type: "card",
    accept: "card",
    group: listId,
  });

  return <div ref={ref} />;
}
