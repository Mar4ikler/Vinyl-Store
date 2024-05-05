import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, Max, Min } from 'class-validator';

export class GuestFindVinylDto {
    @ApiPropertyOptional({ description: 'take must be from 1 to 50' })
    @IsOptional()
    @Min(1)
    @Max(50)
    take: number;

    @ApiPropertyOptional({ description: 'skip must be more then 0 or equals' })
    @IsOptional()
    @Min(0)
    skip: number;
}
