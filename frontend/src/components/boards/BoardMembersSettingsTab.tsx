"use client";

import { useState } from "react";

import type { BoardDetailsResponseDto } from "@/lib/api/generated/boardsAPI.schemas";
import { Card } from "../ui/card";
import AddBoardMemberForm from "./AddBoardMemberForm";
import { useAddBoardMemberMutation } from "@/hooks/boards/use-add-board-member-mutation";
import { useBoardMembersControllerFindBoardMembers } from "@/lib/api/generated/board-members/board-members";

type BoardMembersSettingsTabProps = {
  board: BoardDetailsResponseDto;
};

export default function BoardMembersSettingsTab({
  board,
}: BoardMembersSettingsTabProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [resetSignal, setResetSignal] = useState(0);
  const addBoardMemberMutation = useAddBoardMemberMutation({
    boardId: board.id,
    onSuccess: () => {
      setSubmitError(null);
      setResetSignal((value) => value + 1);
    },
    onErrorMessage: (message) => {
      setSubmitError(message);
    },
  });

  function handleAddBoardMember(email: string) {
    setSubmitError(null);

    addBoardMemberMutation.mutate({
      boardId: board.id,
      data: {
        email,
      },
    });
  }

  const boardMembers = useBoardMembersControllerFindBoardMembers(board.id);
  console.log(boardMembers.data?.data);

  return (
    <div className="flex gap-2 flex-col">
      <Card className="px-6">
        <AddBoardMemberForm
          isPending={addBoardMemberMutation.isPending}
          submitError={submitError}
          onSubmitEmail={handleAddBoardMember}
          resetSignal={resetSignal}
        />
      </Card>
      <Card className="px-6">{/* <BoardMembersDataTable /> */}</Card>
    </div>
  );
}
