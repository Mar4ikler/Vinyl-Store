import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class FindReviewDto {
    @ApiPropertyOptional({ description: 'take must be from 1 to 50', default: 10 })
    @IsOptional()
    @Min(1)
    @Max(50)
    take: number = 10;

    @ApiPropertyOptional({ description: 'skip must be more then 0 equals', default: 0 })
    @IsOptional()
    @Min(0)
    skip: number = 0;

    @ApiProperty({ description: 'vinylId is a required field' })
    @IsNotEmpty({ message: 'vinylId is a required field' })
    @IsNumber()
    vinylId: number;
}
