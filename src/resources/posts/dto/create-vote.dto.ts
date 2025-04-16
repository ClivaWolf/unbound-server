import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty } from "class-validator";

export class CreateVoteDto {
  @ApiProperty({ example: 1, description: "Vote value: +1 for upvote, -1 for downvote" })
  @IsNotEmpty()
  @IsIn([1, -1])
  value: number;
}