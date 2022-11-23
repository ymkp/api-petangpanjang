import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';

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

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TransactionItemInputDTO)
  data: TransactionItemInputDTO[];
}

export class AddMemberToTransactionInputDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  memberId: number;
}

export class TransactionEditInputDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  memberId: number;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TransactionItemInputDTO)
  data: TransactionItemInputDTO[];
}

export class TransactionPayInputDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  memberId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  paid: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  paymentTypeId: number;
}
