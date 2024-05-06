import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, Max, Min } from 'class-validator';

export class FindVinylDto {
    @ApiPropertyOptional({ description: 'take must be from 1 to 50', default: 10 })
    @IsOptional()
    @Min(1)
    @Max(50)
    take: number = 10;

    @ApiPropertyOptional({ description: 'skip must be more then 0 or equals', default: 0 })
    @IsOptional()
    @Min(0)
    skip: number = 0;

    @ApiPropertyOptional()
    @IsOptional()
    filterString: string;

    @ApiPropertyOptional({ description: 'sortParam must be price, name or description' })
    @IsOptional()
    @IsIn(['price', 'name', 'authorName'])
    sortParam: string;

    @ApiPropertyOptional({ description: 'sortOption must be ASC or DESC' })
    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    sortOption: string;
}
