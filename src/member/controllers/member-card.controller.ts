import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  MemberCardAssignUserDTO,
  MemberCardInputCreateDTO,
} from '../dtos/member-card-input.dto';
import { MemberCardOutputDTO } from '../dtos/member-card.output.dto';
import { MemberCardService } from '../services/member-card.service';
import { MemberService } from '../services/member.service';

@ApiTags('member-card')
@Controller('member-card')
// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
export class MemberCardController {
  constructor(private readonly service: MemberCardService) {}

  // create new card
  @Post('new')
  @ApiOperation({
    summary: 'create a new member card',
  })
  public async createANewMemberCard(
    @Body() input: MemberCardInputCreateDTO,
  ): Promise<MemberCardOutputDTO> {
    return await this.service.createNewMemberCard(input);
  }

  // assign a user to a card
  @Patch('assign/member')
  @ApiOperation({
    summary: 'assign member to card',
  })
  public async assignUserToMemberCard(
    @Body() input: MemberCardAssignUserDTO,
  ): Promise<MemberCardOutputDTO> {
    return await this.service.assignUserToCard(input);
  }
}
