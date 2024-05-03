import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, Length } from 'class-validator';

export class UpdateUserDto {
    @ApiPropertyOptional({ description: 'firstName must be from 2 to 20 symbols' })
    @IsOptional()
    @Length(2, 20, { message: 'firstName must be from 2 to 20 symbols' })
    firstName: string;

    @ApiPropertyOptional({ description: 'lastName must be from 2 to 20 symbols' })
    @IsOptional()
    @Length(2, 20, { message: 'lastName must be from 2 to 20 symbols' })
    lastName: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    birthdate: Date;

    @ApiPropertyOptional({ description: 'avatar must be from 2 to 20 symbols' })
    @IsOptional()
    @Length(2, 20, { message: 'avatar must be from 2 to 20 symbols' })
    avatar: string;
}
