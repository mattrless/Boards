import { BoardMemberResponseDto } from "../api/generated/boardsAPI.schemas";

export type BoardMemberActionButtonProps = {
  boardId: number;
  member: BoardMemberResponseDto;
  disabled?: boolean;
};
