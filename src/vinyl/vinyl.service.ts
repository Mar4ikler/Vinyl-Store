import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVinylDto } from './dto/create-vinyl.dto';
import { UpdateVinylDto } from './dto/update-vinyl.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vinyl } from './entities/vinyl.entity';
import { Like, Raw, Repository } from 'typeorm';
import { VinylResponse } from '../interfaces/vinyl-response';
import { FindVinylDto } from './dto/find-vinyl.dto';
import { StripeService } from '../stripe/stripe.service';

@Injectable()
export class VinylService {
    constructor(
        @InjectRepository(Vinyl)
        private vinylsRepository: Repository<Vinyl>
    ) {}

    async create(createVinylDto: CreateVinylDto): Promise<Vinyl> {
        const newVinyl = await this.vinylsRepository.save({ ...createVinylDto });
        return newVinyl;
    }

    async update(id: number, updateVinylDto: UpdateVinylDto): Promise<Vinyl> {
        await this.vinylsRepository.update(id, updateVinylDto);
        return this.vinylsRepository.findOne({ where: { id } });
    }

    async remove(id: number): Promise<number> {
        const deleteResult = await this.vinylsRepository.delete({ id });
        if (!deleteResult.affected) throw new BadRequestException('This vinyl does not exist');
        return id;
    }

    async find(take: number, skip: number): Promise<VinylResponse> {
        const vinyls = await this.vinylsRepository.find({
            take: take,
            skip: skip,
        });

        const count: number = await this.vinylsRepository.count();

        const pages = Math.ceil(count / take);

        return {
            vinyls,
            pages,
            take,
            skip,
        };
    }

    async findUniversal(findVinylDto: FindVinylDto): Promise<VinylResponse> {
        const take = +findVinylDto.take;
        const skip = +findVinylDto.skip;
        const filterString = findVinylDto.filterString;
        const sortParam = findVinylDto.sortParam;
        const sortOption = findVinylDto.sortOption;

        const where = filterString
            ? [
                  { name: Raw((alias) => `LOWER(${alias}) LIKE LOWER('%${filterString}%')`) },
                  { authorName: Raw((alias) => `LOWER(${alias}) LIKE LOWER('%${filterString}%')`) },
              ]
            : {};

        const order = sortParam && sortOption ? { [sortParam]: sortOption } : {};

        const vinyls = await this.vinylsRepository.find({
            take: take,
            skip: skip,
            where: where,
            order: order,
        });

        const count: number = await this.vinylsRepository.count({ where: where });

        const pages = Math.ceil(count / take);

        return {
            vinyls,
            pages,
            take,
            skip,
        };
    }

    findById(id: number): Promise<Vinyl> {
        return this.vinylsRepository.findOneBy({ id });
    }
}
