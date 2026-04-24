import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(username: string, pass: string) {
    // 1. Find the user
    const user = await this.usersService.findOneToLogin(username);

    // 2. If user doesn't exist, throw error immediately
    // This tells TypeScript: if we move past this line, 'user' DEFINITELY exists.
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Compare hashed passwords
    const isMatch = await bcrypt.compare(pass, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 4. Now TypeScript knows 'user' is not null, so this is safe:
    const payload = { sub: user.id, username: user.username };
    
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        image: user.image,
        roleId: user.roleId,
  
        role: {
          name: user.role?.name,
        },
      },
    };
  } 
}