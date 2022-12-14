import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  ParseIntPipe,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SuperAdminGuard } from 'src/auth/guards/superadmin.guard';
import { IdValNumberDTO } from 'src/shared/dtos/id-value-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto';
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';

import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import {
  UserEditBody,
  UserEditPasswordBody,
  UserFilterInput,
} from '../dtos/user-input.dto';
import { UserOutput, UserOutputMini } from '../dtos/user-output.dto';
import { UserService } from '../services/user.service';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('me')
  @ApiOperation({
    summary: 'Get user me API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(UserOutput),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  async getMyProfile(
    @ReqContext() ctx: RequestContext,
  ): Promise<BaseApiResponse<UserOutput>> {
    const user = await this.userService.findById(ctx, ctx.user.id);
    return { data: user, meta: {} };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @ApiOperation({
    summary: 'Get users as a list API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([UserOutput]),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  async getUsers(
    @ReqContext() ctx: RequestContext,
    @Query() query: PaginationParamsDto,
  ): Promise<BaseApiResponse<UserOutput[]>> {
    const { users, count } = await this.userService.getUsers(ctx, query.limit);

    return { data: users, meta: { count } };
  }

  @Get('count/user')
  @UseGuards(SuperAdminGuard)
  @ApiOperation({
    summary: 'get users count',
  })
  async getUsersCount(): Promise<IdValNumberDTO> {
    const value = await this.userService.countUser();
    return { id: 0, value };
  }

  @Get('/pagination/')
  @ApiOperation({
    summary: 'get users with pagination and filter',
  })
  async getUsersWithPaginationAndFilters(
    @ReqContext() ctx: RequestContext,
    @Query() query: PaginationParamsDto,
    @Query() filter: UserFilterInput,
  ): Promise<BaseApiResponse<UserOutputMini[]>> {
    return await this.userService.getUsersWithFilterAndPagination(
      ctx,
      query,
      filter,
    );
  }

  @Get('/pagination/admin')
  @ApiOperation({
    summary: 'get users with pagination and filter',
  })
  @UseGuards(SuperAdminGuard)
  async getAdminWithPaginationAndFilters(
    @ReqContext() ctx: RequestContext,
    @Query() query: PaginationParamsDto,
    @Query() filter: UserFilterInput,
  ): Promise<BaseApiResponse<UserOutputMini[]>> {
    filter.isSuperAdmin = true;
    return await this.userService.getUsersWithFilterAndPagination(
      ctx,
      query,
      filter,
    );
  }

  // TODO: ADD RoleGuard
  // NOTE : This can be made a admin only endpoint. For normal users they can use GET /me
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  @ApiOperation({
    summary: 'Get user by id API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(UserOutput),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  async getUser(
    @ReqContext() ctx: RequestContext,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BaseApiResponse<UserOutput>> {
    const user = await this.userService.getUserById(ctx, id);
    return { data: user, meta: {} };
  }

  // NOTE : This can be made a admin only endpoint. For normal users they can use PATCH /me
  @Patch('edit')
  @ApiOperation({
    summary: 'Update user API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(UserOutput),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async updateUser(
    @ReqContext() ctx: RequestContext,
    @Body() input: UserEditBody,
  ): Promise<BaseApiResponse<UserOutput>> {
    const user = await this.userService.updateUser(ctx, input);
    return { data: user, meta: {} };
  }

  @Patch('edit/password')
  @ApiOperation({
    summary: 'Update user password',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async editPassword(
    @ReqContext() ctx: RequestContext,
    @Body() input: UserEditPasswordBody,
  ): Promise<void> {
    await this.userService.editPassword(ctx, input);
  }
}
