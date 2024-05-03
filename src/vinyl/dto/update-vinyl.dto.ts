import { IsNumber, IsOptional, Length } from 'class-validator';

export class UpdateVinylDto {
    @IsOptional()
    @Length(2, 30, { message: 'name must be from 2 to 30 symbols' })
    name: string;

    @IsOptional()
    @Length(2, 200, { message: 'description must be from 2 to 200 symbols' })
    description: string;

    @IsOptional()
    @Length(2, 30, { message: 'authorName must be from 2 to 30 symbols' })
    authorName: string;

    @IsOptional()
    @IsNumber()
    price: number;

    @IsOptional()
    @Length(2, 30, { message: 'image must be from 2 to 30 symbols' })
    image: string;
}
