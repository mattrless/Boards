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
import { Card } from "../ui/card";

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
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogTitle></DialogTitle>
      <DialogContent className="sm:max-w-4xl">
        <div className="grid grid-cols-2 gap-2">
          <div className="row-span-2">
            <CardInformationForm card={card} listId={listId} />
          </div>
          <h1 className="justify-self-center self-center text-center text-lg font-semibold tracking-tight">
            Card Members
          </h1>
          <Card>members table</Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
