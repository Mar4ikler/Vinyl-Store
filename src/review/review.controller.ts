import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../types/user-role.enum';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { Review } from './entities/review.entity';
import { UserRequest } from '../interfaces/user-request';
import { FindReviewDto } from './dto/find-review';
import { ReviewResponse } from '../interfaces/review-response';
import { logger } from '../logger/logger.config';
import {
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Review Controller')
@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Roles(UserRole.ADMIN, UserRole.USER)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post()
    @ApiBearerAuth('Bearer Auth')
    @ApiOperation({
        summary: 'Create new review',
        description:
            'This endpoint requires a valid JWT token. The role of the user is determined by the token.',
    })
    @ApiOkResponse({ description: 'Review created' })
    @ApiUnauthorizedResponse({ description: 'Authentication required' })
    @ApiForbiddenResponse({ description: 'Invalid token' })
    async create(
        @Req() req: UserRequest,
        @Body() createReviewDto: CreateReviewDto
    ): Promise<Review> {
        const newReview = await this.reviewService.create(+req.id, createReviewDto);
        logger.info(`Create review with id ${newReview.id}`);
        return newReview;
    }

    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Delete(':id')
    @ApiBearerAuth('Bearer Auth')
    @ApiOperation({
        summary: 'Delete review',
        description:
            'This endpoint requires a valid JWT token. The role of the user is determined by the token.',
    })
    @ApiOkResponse({ description: 'Review deleted' })
    @ApiUnauthorizedResponse({ description: 'Authentication required' })
    @ApiForbiddenResponse({ description: 'Invalid token' })
    async remove(@Param('id') id: number): Promise<number> {
        const deletedReviewId = await this.reviewService.remove(+id);
        logger.info(`Delete review with id ${deletedReviewId}`);
        return deletedReviewId;
    }

    @Roles(UserRole.ADMIN, UserRole.USER)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Get()
    @ApiBearerAuth('Bearer Auth')
    @ApiOperation({
        summary: 'Find vinyl reviews',
        description:
            'This endpoint requires a valid JWT token. The role of the user is determined by the token.',
    })
    @ApiOkResponse({ description: 'Reviews was found' })
    @ApiUnauthorizedResponse({ description: 'Authentication required' })
    @ApiForbiddenResponse({ description: 'Invalid token' })
    async find(@Body() findReviewDto: FindReviewDto): Promise<ReviewResponse> {
        return this.reviewService.find(findReviewDto);
    }
}
