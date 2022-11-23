import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Member } from 'src/member/entities/member.entity';
import { BaseApiResponse } from 'src/shared/dtos/base-api-response.dto';
import {
  AddMemberToTransactionInputDTO,
  TransactionCreateInputDTO,
  TransactionEditInputDTO,
  TransactionPayInputDTO,
} from '../dtos/transaction-input.dto';
import {
  TransactionOutputDTO,
  TransactionOutputMiniDTO,
} from '../dtos/transaction-output.dto';
import { TransactionService } from '../services/transaction.service';

@ApiTags('transaction')
@Controller('transaction')
// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @Post('pay')
  @ApiOperation({ summary: 'pay the transaction' })
  public async payTransaction(
    @Body() body: TransactionPayInputDTO,
  ): Promise<BaseApiResponse<string>> {
    return await this.service.payCompleteTransaction(body);
  }

  // get all transactions by date
  @Get('all')
  @ApiOperation({
    summary: 'get all transactions',
  })
  public async getAllTransactions(): Promise<TransactionOutputDTO[]> {
    return await this.service.getAllTransaction();
  }

  @Get('member-complete-id/:id')
  @ApiOperation({
    summary: 'get complete transactions by member id',
  })
  public async getTransactionCoompleteDetailByMemberId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Member> {
    return await this.service.getTransactionCoompleteDetailByMemberId(id);
  }

  @Get('member-complete/:cardNo')
  @ApiOperation({
    summary: 'get complete transactions by cardNo',
  })
  public async getTransactionCoompleteDetailByCardNo(
    @Param('cardNo') cardNo: string,
  ): Promise<Member> {
    return await this.service.getTransactionCoompleteDetailByCardNo(cardNo);
  }

  // get all transactions by date
  @Get('member/:cardNo')
  @ApiOperation({
    summary: 'get all transactions by cardNo',
  })
  public async getAllTransactionsByCardNo(
    @Param('cardNo') cardNo: string,
  ): Promise<TransactionOutputMiniDTO[]> {
    return await this.service.getAllTransactionByCardNo(cardNo);
  }

  // create a new transaction

  @Post('new')
  @ApiOperation({
    summary: 'create new transaction',
  })
  public async createNewTransaction(
    @Body() input: TransactionCreateInputDTO,
  ): Promise<TransactionOutputDTO> {
    return await this.service.createNewTransaction(input);
  }

  // edit a transaction
  @Patch('edit/member')
  @ApiOperation({
    summary: 'add a member to transaction',
  })
  public async addMemberToTransaction(
    @Body() input: AddMemberToTransactionInputDTO,
  ): Promise<TransactionOutputDTO> {
    return await this.service.addMemberToATransaction(input);
  }

  // close a transaction
}
