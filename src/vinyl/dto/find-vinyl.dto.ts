import { IsIn, IsOptional, Max, Min } from 'class-validator';

export class FindVinylDto {
    @IsOptional()
    @Min(1)
    @Max(50)
    take: number;

    @IsOptional()
    @Min(0)
    skip: number;

    @IsOptional()
    filterString: string;

    @IsOptional()
    @IsIn(['price', 'name', 'authorName'])
    sortParam: string;

    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    sortOption: string;
}
