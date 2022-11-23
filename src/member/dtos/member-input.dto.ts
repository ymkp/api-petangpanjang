import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MemberInputRegisterDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cardNo: string;
}

export class MemberSearchByMemberNoInputDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  memberNo: string;
}

export class MemberSearchByCardNoInputDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cardNo: string;
}
