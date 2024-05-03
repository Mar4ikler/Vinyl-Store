import { IsNotEmpty, IsNumber, Length, Max, Min } from "class-validator";

export class CreateReviewDto {
    @IsNotEmpty({ message: 'comment is a required field' })
    @Length(5, 200, { message: 'comment must be from 2 to 200 symbols' })
    comment: string;

    @IsNotEmpty({ message: 'score is a required field' })
    @Min(1)
    @Max(5)
    score: number;

    @IsNotEmpty({ message: 'vinylId is a required field' })
    @IsNumber()
    vinylId: number;
}
