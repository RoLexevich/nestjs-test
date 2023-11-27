import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from './users.model';
import { UserCreateDto } from './dto/create-user-dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User') private userModel: Model<User>,
        private jwtService: JwtService
        ) {}

    async signUp(data : UserCreateDto) : Promise<any> {
        const {email, password, firstname, lastname} = data;
//        console.log(email, password, firstname, lastname)

        const hashPassword = await bcrypt.hash(password, 10);

        const user = new this.userModel({email, password:hashPassword, firstname, lastname});

        try {
            await user.save();
        } catch(error) {
            if (error.code === 11000) {
                throw new ConflictException('User already exists');
            }
            throw error;
        }
    }
/*
    async findAll() : Promise<User[]> {
        return this.userModel.find().exec()
    }
*/
    async signIn(user: User) {
        const payload = { id: user._id, email: user.email, firstname: user.firstname};
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.userModel.findOne({ email:email }).exec();
    
        if (!user) {
            return null;
        }
    
        const valid = await bcrypt.compare(password, user.password);
    
        if (valid) {
            return user;
        } else {
            return null;
        }    
    }
}
