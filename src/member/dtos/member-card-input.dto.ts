import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MemberCardInputCreateDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  cardNo: string;
}

export class MemberCardAssignUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  memberId: number;
}
