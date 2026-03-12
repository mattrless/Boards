import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { CardResponseDto } from "./card-response.dto";

export class CardPositionUpdatedResponseDto extends CardResponseDto {
  @ApiProperty({ example: 5, description: "Source list id before the move." })
  @Expose()
  sourceListId: number;
}
