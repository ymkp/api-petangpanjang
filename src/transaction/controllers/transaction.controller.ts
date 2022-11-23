import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  AddMemberToTransactionInputDTO,
  TransactionCreateInputDTO,
  TransactionEditInputDTO,
} from '../dtos/transaction-input.dto';
import { TransactionOutputDTO } from '../dtos/transaction-output.dto';
import { TransactionService } from '../services/transaction.service';

@ApiTags('transaction')
@Controller('transaction')
// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  // get all transactions by date
  @Get('all')
  @ApiOperation({
    summary: 'get all transactions',
  })
  public async getAllTransactions(): Promise<TransactionOutputDTO[]> {
    return await this.service.getAllTransaction();
  }

  // get all transactions by date
  @Get('member/:cardNo')
  @ApiOperation({
    summary: 'get all transactions by cardNo',
  })
  public async getAllTransactionsByCardNo(
    @Param('cardNo') cardNo: string,
  ): Promise<TransactionOutputDTO[]> {
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
