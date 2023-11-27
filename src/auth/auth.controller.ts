import { Body, Controller, Post, UsePipes, Get, UseGuards, Request } from '@nestjs/common';
import { joiUserSchema } from 'src/joi/user.joischema';
import { JoiValidationPipe } from 'src/pipe/book.joi-pipe';
import { AuthService } from './auth.service';
import { UserCreateDto } from './dto/create-user-dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { User } from './users.model';

@Controller('/api/users')
export class AuthController {
    constructor(private readonly authService : AuthService) {}

    @Post('/signup')
    @UsePipes(new JoiValidationPipe(joiUserSchema))
    async signUp(@Body() data : UserCreateDto) : Promise<any> {
        return await this.authService.signUp(data);
   }
/*
    @Get()
    async findAll(): Promise<User[]> {
        return this.authService.findAll();
    }
*/
    @UseGuards(LocalAuthGuard)
    @Post('/signin')
    async signIn(@Request() req) {
      return this.authService.signIn(req.user);
    }
}
