import { Module } from '@nestjs/common';
import { User, UsersSchema } from './users.model';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import "dotenv/config";
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        MongooseModule.forFeature([{ name:User.name, schema:UsersSchema }]),
        PassportModule,
        JwtModule.register({
            secret : process.env.JWT_TOKEN_SECRET
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    exports: [AuthService]    
})
export class AuthModule {}
