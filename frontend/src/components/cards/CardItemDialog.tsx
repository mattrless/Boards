"use client";

import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CardSummaryResponseDto } from "@/lib/api/generated/boardsAPI.schemas";
import CardInformationForm from "./CardInformationForm";
import CardMembersDataTable from "./CardMembersDataTable";
import { useBoardsControllerFindMyBoardPermissions } from "@/lib/api/generated/boards/boards";
import { useBoardIdParam } from "@/hooks/boards/use-board-id-param";
import { useCardMembersSocket } from "@/hooks/cards/use-card-members-socket";

type CardItemDialogProps = {
  card: CardSummaryResponseDto;
  listId: number;
  children: ReactNode;
};

export default function CardItemDialog({
  card,
  listId,
  children,
}: CardItemDialogProps) {
  const boardId = useBoardIdParam();

  const userBoardInfoQuery = useBoardsControllerFindMyBoardPermissions(boardId);
  const userBoardInfo =
    userBoardInfoQuery.data?.status === 200
      ? userBoardInfoQuery.data.data
      : undefined;

  const userBoardRole = userBoardInfo?.boardRole;
  const canRemoveMembers = userBoardRole !== "member";

  useCardMembersSocket(boardId, card.id);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogTitle></DialogTitle>
      <DialogContent className="sm:max-w-4xl">
        <div className="grid grid-cols-2 gap-2">
          <div className="row-span-2">
            <CardInformationForm card={card} listId={listId} />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-center text-lg font-semibold tracking-tight">
              Card Members
            </h2>
            <CardMembersDataTable
              boardId={boardId}
              cardId={card.id}
              canRemoveMembers={canRemoveMembers}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
