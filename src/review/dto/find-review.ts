import { IsIn, IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class FindReviewDto {
    @IsOptional()
    @Min(1)
    @Max(50)
    take: number;

    @IsOptional()
    @Min(0)
    skip: number;

    @IsNotEmpty({ message: 'vinylId is a required field' })
    @IsNumber()
    vinylId: number;
}
