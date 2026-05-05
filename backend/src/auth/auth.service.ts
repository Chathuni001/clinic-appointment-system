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
    // 1. Fetch user
    const user = await this.usersService.findOneToLogin(username);

    // 2. Guard: User exists?
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Guard: Password matches?
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 4. Map Privileges correctly based on your schema names
    // We go: user -> role -> rolePrivileges[] -> privilege -> name
    const privileges = user.role?.rolePrivileges.map((rp) => rp.privilege.name) || [];

    // 5. Generate Token
    const payload = { sub: user.id, username: user.username };
    
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        image: user.image,
        role: {
          name: user.role?.name,
        },
        privileges: privileges, // Example: ["CREATE_DOCTOR", "DELETE_USER"]
      },
    };
  }
}