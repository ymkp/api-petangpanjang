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
