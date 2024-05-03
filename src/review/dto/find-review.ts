import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class FindReviewDto {
    @ApiPropertyOptional({ description: 'take must be from 1 to 50' })
    @IsOptional()
    @Min(1)
    @Max(50)
    take: number;

    @ApiPropertyOptional({ description: 'skip must be more then 0 equals' })
    @IsOptional()
    @Min(0)
    skip: number;

    @ApiProperty({ description: 'vinylId is a required field' })
    @IsNotEmpty({ message: 'vinylId is a required field' })
    @IsNumber()
    vinylId: number;
}
