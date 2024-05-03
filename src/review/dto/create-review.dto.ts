import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, Length, Max, Min } from "class-validator";

export class CreateReviewDto {
    @ApiProperty({ description: 'comment must be from 2 to 200 symbols' })
    @IsNotEmpty({ message: 'comment is a required field' })
    @Length(5, 200, { message: 'comment must be from 2 to 200 symbols' })
    comment: string;

    @ApiProperty({ description: 'score must be from 1 to 5' })
    @IsNotEmpty({ message: 'score is a required field' })
    @Min(1)
    @Max(5)
    score: number;

    @ApiProperty({ description: 'vinylId is a required field' })
    @IsNotEmpty({ message: 'vinylId is a required field' })
    @IsNumber()
    vinylId: number;
}
