import { Button } from "@/components/ui/button";
import { CardSummaryResponseDto } from "@/lib/api/generated/boardsAPI.schemas";

export default function CardItem({ item }: { item: CardSummaryResponseDto }) {
  return (
    <Button
      variant="outline"
      className="w-full min-w-0 justify-start text-left"
    >
      <span className="block w-full truncate text-left">{item.title}</span>
    </Button>
  );
}
