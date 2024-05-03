import { IsNotEmpty, IsNumber, IsOptional, Length } from "class-validator";

export class CreateVinylDto {
    @IsNotEmpty({ message: 'name is a required field' })
    @Length(2, 30, { message: 'name must be from 2 to 30 symbols' })
    name: string;

    @IsNotEmpty({ message: 'description is a required field' })
    @Length(2, 200, { message: 'description must be from 2 to 200 symbols' })
    description: string;

    @IsNotEmpty({ message: 'authorName is a required field' })
    @Length(2, 30, { message: 'authorName must be from 2 to 30 symbols' })
    authorName: string;

    @IsNotEmpty({ message: 'price is a required field' })
    @IsNumber()
    price: number;

    @IsOptional()
    @Length(2, 30, { message: 'image must be from 2 to 30 symbols' })
    image: string;
}
