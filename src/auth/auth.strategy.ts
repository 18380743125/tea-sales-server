import * as fs from 'fs';
import * as path from 'path';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(protected configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: fs.readFileSync(
        path.join(__dirname, '../../config/keys/rsa_public_key.pem'),
      ),
    });
  }

  async validate(payload: any) {
    // req.user
    return { userId: payload.id, name: payload.name };
  }
}
