import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class BoardMyPermissionsResponseDto {
  @ApiProperty({ example: 42, description: "Target board id." })
  @Expose()
  boardId: number;

  @ApiPropertyOptional({
    example: "admin",
    description:
      'Current user board role name. For system admins outside membership, this can be "system_admin".',
  })
  @Expose()
  boardRole?: string;

  @ApiProperty({
    description: "Indicates whether the current user owns this board.",
    example: false,
  })
  @Expose()
  isOwner: boolean;

  @ApiProperty({
    type: [String],
    example: ["board_read_full_board", "list_read", "card_read"],
    description: "Effective board-scoped permissions for this board context.",
  })
  @Expose()
  permissions: string[];
}
