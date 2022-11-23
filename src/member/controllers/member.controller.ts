import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MemberCardOutputDTO } from '../dtos/member-card.output.dto';
import {
  MemberInputRegisterDTO,
  MemberSearchByCardNoInputDTO,
  MemberSearchByMemberNoInputDTO,
} from '../dtos/member-input.dto';
import { MemberOutputDTO } from '../dtos/member-output.dto';
import { MemberService } from '../services/member.service';

@ApiTags('member')
@Controller('member')
// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
export class MemberController {
  constructor(private readonly service: MemberService) {}

  @Get('card/available')
  @ApiOperation({
    summary: 'get available cards',
  })
  public async getAvailableCards(): Promise<MemberCardOutputDTO[]> {
    return await this.service.getAvailableCards();
  }

  @Get('members/active')
  @ApiOperation({ summary: 'get active members' })
  public async getActiveMembers(): Promise<MemberOutputDTO[]> {
    return await this.service.getActiveMembers();
  }

  @Get('members/completed')
  @ApiOperation({ summary: 'get completed members' })
  public async getCompletedMembers(): Promise<MemberOutputDTO[]> {
    return await this.service.getCompletedMembers();
  }

  // create new member
  @Post('new')
  @ApiOperation({
    summary: 'create new member',
  })
  public async createNewMember(
    @Body() input: MemberInputRegisterDTO,
  ): Promise<MemberOutputDTO> {
    return await this.service.createMember(input);
  }

  // get member info from member no

  // get member info from member no
  @Post('search/cardNo')
  @ApiOperation({
    summary: 'get member info by memberno',
  })
  public async getMemberInfoByCardNo(
    @Body() input: MemberSearchByCardNoInputDTO,
  ): Promise<MemberOutputDTO> {
    return await this.service.getMemberByCardNo(input.cardNo);
  }
}
