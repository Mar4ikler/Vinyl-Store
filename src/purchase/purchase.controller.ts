import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
    Headers,
    UsePipes,
    RawBodyRequest,
    Query,
} from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../types/user-role.enum';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { UserRequest } from '../interfaces/user-request';
import { logger } from '../logger/logger.config';
import { Purchase } from './entities/purchase.entity';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiExcludeEndpoint,
    ApiForbiddenResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Purchase Controller')
@Controller('purchase')
export class PurchaseController {
    constructor(private readonly purchaseService: PurchaseService) {}

    @Roles(UserRole.ADMIN, UserRole.USER)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post()
    @ApiBearerAuth('Bearer Auth')
    @ApiOperation({
        summary: 'Create new purchase',
        description:
            'This endpoint requires a valid JWT token. The role of the user is determined by the token.',
    })
    @ApiCreatedResponse({ description: 'Purchase created' })
    @ApiUnauthorizedResponse({ description: 'Authentication required' })
    @ApiForbiddenResponse({ description: 'Invalid token' })
    @ApiBadRequestResponse({ description: 'This vinyl does not exists' })
    async purchase(@Req() req: UserRequest, @Query('vinylId') vinylId: number): Promise<Purchase> {
        const purchase = await this.purchaseService.create(+vinylId, +req.id);
        logger.info(`Create new purchase with id ${purchase.id}`);
        return purchase;
    }

    @Post('webhook')
    @ApiExcludeEndpoint()
    async handleStripeWebhook(
        @Req() req: RawBodyRequest<Request>,
        @Headers('stripe-signature') signature: string
    ) {
        const raw = req.rawBody;
        return await this.purchaseService.webhook(raw, signature);
    }
}
