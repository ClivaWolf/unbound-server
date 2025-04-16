import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto, UpdatePostDto } from "./dto/create-post.dto";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JWTAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { UserId } from "../../decorators/user-id.decorator";
import { log } from "console";
import { CreateCommentDto, UpdateCommentDto } from "./dto/create-comment.dto";

@ApiTags("posts")
@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: "Create post", description: "Create a new post" })
  @ApiBearerAuth()
  @ApiBody({ type: CreatePostDto })
  create(@UserId() userId: string, @Body() dto: CreatePostDto) {
    console.log('try to create post');
    return this.postsService.create(userId, dto);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get post by ID", description: "Retrieve a post by its ID" })
  findById(@Param("id") id: string) {
    return this.postsService.findById(id);
  }

  @Get("user/:login")
  @ApiOperation({ summary: "Get user posts", description: "Retrieve posts by user login" })
  findByUserLogin(
    @Param("login") login: string,
    @Query("page") page: number,
    @Query("limit") limit: number,
  ) {
    return this.postsService.findByUserLogin(login, page, limit);
  }

  @Patch(":id")
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: "Update post", description: "Update an existing post" })
  @ApiBearerAuth()
  @ApiBody({ type: UpdatePostDto })
  update(@Param("id") id: string, @UserId() userId: string, @Body() dto: UpdatePostDto) {
    return this.postsService.update(id, userId, dto);
  }

  @Delete(":id")
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: "Delete post", description: "Delete a post" })
  @ApiBearerAuth()
  delete(@Param("id") id: string, @UserId() userId: string) {
    return this.postsService.delete(id, userId);
  }

  @Post(":id/comments")
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: "Create comment", description: "Add a comment to a post" })
  @ApiBearerAuth()
  @ApiBody({ type: CreateCommentDto })
  createComment(@Param("id") postId: string, @UserId() userId: string, @Body() dto: CreateCommentDto) {
    return this.postsService.createComment(postId, userId, dto);
  }

  @Patch("comments/:commentId")
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: "Update comment", description: "Update an existing comment" })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateCommentDto })
  updateComment(@Param("commentId") commentId: string, @UserId() userId: string, @Body() dto: UpdateCommentDto) {
    return this.postsService.updateComment(commentId, userId, dto);
  }

  @Delete("comments/:commentId")
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: "Delete comment", description: "Delete a comment" })
  @ApiBearerAuth()
  deleteComment(@Param("commentId") commentId: string, @UserId() userId: string) {
    return this.postsService.deleteComment(commentId, userId);
  }
}