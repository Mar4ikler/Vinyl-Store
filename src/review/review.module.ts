import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Vinyl } from '../vinyl/entities/vinyl.entity';
import { VinylModule } from '../vinyl/vinyl.module';

@Module({
    imports: [TypeOrmModule.forFeature([Review]), VinylModule],
    controllers: [ReviewController],
    providers: [ReviewService],
})
export class ReviewModule {}
