import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtAuthStrategy } from '../auth/strategies/jwt-auth.strategy';
import { SharedModule } from '../shared/shared.module';
import { UserController } from './controllers/user.controller';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';
import { UserAclService } from './services/user-acl.service';
import { TypeOrmExModule } from 'src/shared/typeorm-ex.module';
import { SSOTokenRepository } from './repositories/sso-token.repository';
import { SSOService } from './services/sso.service';

@Module({
  imports: [
    SharedModule,
    TypeOrmExModule.forCustomRepository([UserRepository, SSOTokenRepository]),
  ],
  providers: [UserService, JwtAuthStrategy, UserAclService, SSOService],
  controllers: [UserController],
  exports: [UserService, SSOService],
})
export class UserModule {}
