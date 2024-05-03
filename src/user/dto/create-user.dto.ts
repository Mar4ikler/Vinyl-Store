import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDateString, IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ description: 'firstName must be from 2 to 20 symbols' })
    @IsNotEmpty({ message: 'firstName is a required field' })
    @Length(2, 20, { message: 'firstName must be from 2 to 20 symbols' })
    firstName: string;

    @ApiProperty({ description: 'lastName must be from 2 to 20 symbols' })
    @IsNotEmpty({ message: 'lastName is a required field' })
    @Length(2, 20, { message: 'lastName must be from 2 to 20 symbols' })
    lastName: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'email is a required field' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'password must be from 2 to 20 symbols' })
    @IsNotEmpty({ message: 'password is a required field' })
    @Length(2, 20, { message: 'password must be from 2 to 20 symbols' })
    password: string;

    @ApiProperty({ description: 'birthdate should be like yyyy-mm-dd' })
    @IsOptional()
    @IsDateString()
    birthdate: Date;

    @ApiProperty({ description: 'avatar must be from 2 to 20 symbols' })
    @IsOptional()
    @Length(2, 20, { message: 'avatar must be from 2 to 20 symbols' })
    avatar: string;
}
