import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
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
  @Patch('edit')
  @ApiOperation({
    summary: 'edit a transaction',
  })
  public async editATransaction(
    @Body() input: TransactionEditInputDTO,
  ): Promise<TransactionOutputDTO> {
    return await this.service.editATransaction(input);
  }

  // close a transaction
}
