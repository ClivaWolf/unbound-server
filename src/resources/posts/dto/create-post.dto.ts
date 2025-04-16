import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional, IsString } from "class-validator";
import { PartialType } from "@nestjs/swagger";

enum PostVisibility {
  PUBLIC = "public",
  FOLLOWERS = "followers",
  PRIVATE = "private",
}

export class CreatePostDto {
  @ApiProperty({
    example: [{ layout: [{ width: "12/12", content: "<p>Title</p>" }] }],
    description: "Blocks of the post",
  })
  @IsArray()
  blocks: { layout: { width: string; content: string }[] }[];

  @ApiProperty({ example: "#f0f0f0", description: "Background color or image path" })
  @IsString()
  @IsOptional()
  background?: string;

  @ApiProperty({ example: "rounded", description: "Border style" })
  @IsString()
  @IsOptional()
  border?: string;

  @ApiProperty({ example: "public", description: "Post visibility" })
  @IsEnum(PostVisibility)
  @IsOptional()
  visibility?: PostVisibility;
}

export class UpdatePostDto extends PartialType(CreatePostDto) {}