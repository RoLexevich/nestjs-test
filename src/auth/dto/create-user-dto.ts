import { Users } from "../users.interface";

export class UserCreateDto {
    email : Users['email'];
    password : Users['password'];
    firstname : Users['firstname'];
    lastname : Users['lastname'];
}