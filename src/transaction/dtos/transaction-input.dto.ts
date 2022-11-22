import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class TransactionItemInputDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  itemId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  itemQuantity: number;
}

export class TransactionCreateInputDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  memberId: number;
  data: TransactionItemInputDTO[];
}

export class TransactionEditInputDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  memberId: number;

  data: TransactionItemInputDTO[];
}
