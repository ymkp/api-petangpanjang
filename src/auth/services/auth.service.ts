import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { hash } from 'bcrypt';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { UserOutput } from '../../user/dtos/user-output.dto';
import { UserService } from '../../user/services/user.service';
import { RegisterInput } from '../dtos/auth-register-input.dto';
import { RegisterOutput } from '../dtos/auth-register-output.dto';
import {
  AuthTokenOutput,
  UserAccessTokenClaims,
} from '../dtos/auth-token-output.dto';
import { SSOService } from 'src/user/services/sso.service';
import { IdNameStringDTO } from 'src/shared/dtos/id-value-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly ssoService: SSOService,
  ) {}

  async getUserByNRP(nrp: string): Promise<IdNameStringDTO> {
    const res = await this.userService.getUserIDNameDTOByNRP(nrp);
    return res;
  }

  async grantSuperAdminToUser(
    ctx: RequestContext,
    ids: number[],
  ): Promise<void> {
    await this.userService.grantSuperAdminToUser(ctx, ids);
  }

  async revokeSuperAdminFromUser(
    ctx: RequestContext,
    ids: number[],
  ): Promise<void> {
    await this.userService.revokeSuperAdminFromUser(ctx, ids);
  }

  async validateUser(
    ctx: RequestContext,
    username: string,
    pass: string,
  ): Promise<UserAccessTokenClaims> {
    const user = await this.userService.validateUsernamePassword(
      username,
      pass,
    );

    // Prevent disabled users from logging in.
    if (user.isAccountDisabled) {
      throw new UnauthorizedException('This user account has been disabled');
    }

    return user;
  }

  login(ctx: RequestContext): AuthTokenOutput {
    return this.getAuthToken(ctx.user);
  }

  async logout(ctx: RequestContext): Promise<void> {
    // TODO : implement logout
  }

  async register(
    ctx: RequestContext,
    input: RegisterInput,
  ): Promise<RegisterOutput> {
    const requestor = await this.userService.getByContext(ctx);

    input.isAccountDisabled = false;
    if (!input.password) {
      input.password = await this.createRandomPassword(input.email);
    }
    const registeredUser = await this.userService.createUser(ctx, input);

    return plainToInstance(RegisterOutput, registeredUser, {
      excludeExtraneousValues: true,
    });
  }

  async refreshToken(ctx: RequestContext): Promise<AuthTokenOutput> {
    const user = await this.userService.findById(ctx, ctx.user.id);
    if (!user) {
      throw new UnauthorizedException('Invalid user id');
    }

    return this.getAuthToken(user);
  }

  getAuthToken(user: UserAccessTokenClaims | UserOutput): AuthTokenOutput {
    const subject = { sub: user.id };
    const payload = {
      username: user.username,
      sub: user.id,
      divisiId: user.divisiId,
      bagianId: user.bagianId,
      isSuperAdmin: user.isSuperAdmin,
    };
    const authToken = {
      refreshToken: this.jwtService.sign(subject, {
        expiresIn: this.configService.get('jwt.refreshTokenExpiresInSec'),
      }),
      accessToken: this.jwtService.sign(
        { ...payload, ...subject },
        {
          expiresIn: this.configService.get('jwt.accessTokenExpiresInSec'),
        },
      ),
    };
    return plainToInstance(AuthTokenOutput, authToken, {
      excludeExtraneousValues: true,
    });
  }

  public async generateSSOToken(
    identificationNo: string,
  ): Promise<{ data: string; url: string }> {
    const user = await this.userService.findByIdentificationNumber(
      identificationNo,
    );
    const expiresIn =
      this.configService.get('jwt.refreshTokenExpiresInSec') / 10;
    const subject = { sub: user.username };
    let ssoToken = this.jwtService.sign(subject, {
      expiresIn,
    });
    const tokenToSave = await hash(ssoToken, 10);
    await this.ssoService.saveSSOToken(tokenToSave, user.id, expiresIn);
    return {
      data: ssoToken,
      url: this.configService.get('ssoLoginURL') + ssoToken,
    };
  }

  public async useSSOToken(
    ctx: RequestContext,
    ssoToken: string,
  ): Promise<AuthTokenOutput> {
    const user = await this.userService.findByUsername(
      ctx,
      ctx.user.id.toString(),
    );
    await this.ssoService.useSSOToken(user.id, ssoToken);
    return this.getAuthToken(user);
  }

  private async createRandomPassword(email: string): Promise<string> {
    // TODO : create random string 10 password
    // TODO : create email service, and send the password to email
    return Array(10)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {});
      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  public async changeForgottenPassword(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);
    await this.userService.editPassword(
      {
        ip: '',
        requestID: '',
        url: '',
        user: {
          id: user.id,
          bagianId: 0,
          divisiId: 0,
          isSuperAdmin: false,
          username: '',
        },
      },
      { password },
    );
  }
}
