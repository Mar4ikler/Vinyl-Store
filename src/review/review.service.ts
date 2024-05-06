import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { FindReviewDto } from './dto/find-review';
import { ReviewResponse } from '../interfaces/review-response';
import { Vinyl } from '../vinyl/entities/vinyl.entity';
import { VinylService } from '../vinyl/vinyl.service';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private reviewsRepository: Repository<Review>,
        private vinylService: VinylService
    ) {}

    async create(userId: number, createReviewDto: CreateReviewDto): Promise<Review> {
        const vinyl = await this.vinylService.findById(createReviewDto.vinylId);
        if (!vinyl) throw new BadRequestException('This vinyl does not exist')
        const newReview = await this.reviewsRepository.save({
            ...createReviewDto,
            authorId: userId,
        });
        return newReview;
    }

    async remove(id: number): Promise<number> {
        const deleteResult = await this.reviewsRepository.delete({ id });
        if (!deleteResult.affected) throw new BadRequestException('This review does not exist');
        return id;
    }

    async find(findReviewDto: FindReviewDto): Promise<ReviewResponse> {
        const take = +findReviewDto.take ?? 50;
        const skip = +findReviewDto.skip ?? 0;
        const vinylId = +findReviewDto.vinylId;

        const reviews = await this.reviewsRepository.find({
            take: take,
            skip: skip,
            where: { vinylId },
        });

        const count: number = await this.reviewsRepository.count({ where: { vinylId } });

        const pages = Math.ceil(count / take);

        return {
            reviews,
            pages,
            take,
            skip,
        };
    }
}
