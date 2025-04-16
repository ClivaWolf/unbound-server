import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto, UpdatePostDto } from "./dto/create-post.dto";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JWTAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { UserId } from "../../decorators/user-id.decorator";
import { CreateCommentDto, UpdateCommentDto } from "./dto/create-comment.dto";
import { CreateVoteDto } from "./dto/create-vote.dto";
import { VotesService } from "./votes.service";

@ApiTags("posts")
@Controller("posts")
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly votesService: VotesService,
  ) { }

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

  @Post(":id/vote")
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: "Vote on post", description: "Add an upvote (+1) or downvote (-1) to a post" })
  @ApiBearerAuth()
  @ApiBody({ type: CreateVoteDto })
  votePost(@Param("id") postId: string, @UserId() userId: string, @Body() dto: CreateVoteDto) {
    return this.votesService.votePost(postId, userId, dto);
  }

  @Delete(":id/vote")
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: "Remove vote from post", description: "Remove a vote from a post" })
  @ApiBearerAuth()
  removeVotePost(@Param("id") postId: string, @UserId() userId: string) {
    return this.votesService.removeVotePost(postId, userId);
  }

  @Post("comments/:commentId/vote")
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: "Vote on comment", description: "Add an upvote (+1) or downvote (-1) to a comment" })
  @ApiBearerAuth()
  @ApiBody({ type: CreateVoteDto })
  voteComment(@Param("commentId") commentId: string, @UserId() userId: string, @Body() dto: CreateVoteDto) {
    return this.votesService.voteComment(commentId, userId, dto);
  }

  @Delete("comments/:commentId/vote")
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: "Remove vote from comment", description: "Remove a vote from a comment" })
  @ApiBearerAuth()
  removeVoteComment(@Param("commentId") commentId: string, @UserId() userId: string) {
    return this.votesService.removeVoteComment(commentId, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts', description: 'Retrieve all public posts with pagination' })
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.postsService.findAll(page, limit);
  }
}