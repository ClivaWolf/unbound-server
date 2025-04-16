import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";
import { PartialType } from "@nestjs/swagger";

export class CreateCommentDto {
  @ApiProperty({ example: "Amazing artwork!", description: "Comment content" })
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class UpdateCommentDto extends PartialType(CreateCommentDto) {}