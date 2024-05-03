import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, Length } from "class-validator";

export class CreateVinylDto {
    @ApiProperty({ description: 'name must be from 2 to 30 symbols' })
    @IsNotEmpty({ message: 'name is a required field' })
    @Length(2, 30, { message: 'name must be from 2 to 30 symbols' })
    name: string;

    @ApiProperty({ description: 'description must be from 2 to 200 symbols' })
    @IsNotEmpty({ message: 'description is a required field' })
    @Length(2, 200, { message: 'description must be from 2 to 200 symbols' })
    description: string;

    @ApiProperty({ description: 'authorName must be from 2 to 30 symbols' })
    @IsNotEmpty({ message: 'authorName is a required field' })
    @Length(2, 30, { message: 'authorName must be from 2 to 30 symbols' })
    authorName: string;

    @ApiProperty({ description: 'price should be a number' })
    @IsNotEmpty({ message: 'price is a required field' })
    @IsNumber()
    price: number;

    @ApiPropertyOptional({ description: 'image must be from 2 to 30 symbols' })
    @IsOptional()
    @Length(2, 30, { message: 'image must be from 2 to 30 symbols' })
    image: string;
}
