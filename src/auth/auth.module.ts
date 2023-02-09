import * as fs from 'fs';
import * as path from 'path';
import { Global, Module } from "@nestjs/common";
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './auth.strategy';

@Global()
@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => {
        const privateKey = fs.readFileSync(
          path.join(__dirname, '../../config/keys/rsa_private_key.pem'),
        );
        const publicKey = fs.readFileSync(
          path.join(__dirname, '../../config/keys/rsa_public_key.pem'),
        );
        return {
          privateKey,
          publicKey,
          signOptions: {
            algorithm: 'RS256',
            expiresIn: '1d',
          },
        } as JwtModuleOptions;
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
