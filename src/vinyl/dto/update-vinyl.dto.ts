import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Length } from 'class-validator';

export class UpdateVinylDto {
    @ApiPropertyOptional({ description: 'name must be from 2 to 30 symbols' })
    @IsOptional()
    @Length(2, 30, { message: 'name must be from 2 to 30 symbols' })
    name: string;

    @ApiPropertyOptional({ description: 'description must be from 2 to 200 symbols' })
    @IsOptional()
    @Length(2, 200, { message: 'description must be from 2 to 200 symbols' })
    description: string;

    @ApiPropertyOptional({ description: 'authorName must be from 2 to 30 symbols' })
    @IsOptional()
    @Length(2, 30, { message: 'authorName must be from 2 to 30 symbols' })
    authorName: string;

    @ApiPropertyOptional({ description: 'price should be a number' })
    @IsOptional()
    @IsNumber()
    price: number;

    @ApiPropertyOptional({ description: 'image must be from 2 to 30 symbols' })
    @IsOptional()
    @Length(2, 30, { message: 'image must be from 2 to 30 symbols' })
    image: string;
}
