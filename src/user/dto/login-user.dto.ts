import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginUserDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'email is a required field' })
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'password is a required field' })
    password: string;
}
