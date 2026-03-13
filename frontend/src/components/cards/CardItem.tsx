import { buttonVariants } from "@/components/ui/button";
import { CardSummaryResponseDto } from "@/lib/api/generated/boardsAPI.schemas";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/react/sortable";
import CardItemDialog from "./CardItemDialog";

export default function CardItem({
  item,
  index,
  listId,
}: {
  item: CardSummaryResponseDto;
  index: number;
  listId: number;
}) {
  const { ref, isDragging } = useSortable({
    id: `card-${item.id}`,
    index,
    type: "card",
    accept: "card",
    group: listId,
  });

  return (
    <CardItemDialog card={item} listId={listId}>
      <div
        ref={ref}
        role="button"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-full min-w-0 justify-start text-left cursor-pointer",
          isDragging && "opacity-70",
        )}
      >
        <span className="w-full truncate text-left">{item.title}</span>
      </div>
    </CardItemDialog>
  );
}
