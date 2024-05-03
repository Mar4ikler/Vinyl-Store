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
} from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../types/user-role.enum';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { UserRequest } from '../interfaces/user-request';
import { logger } from '../logger/logger.config';
import { Purchase } from './entities/purchase.entity';

@Controller('purchase')
export class PurchaseController {
    constructor(private readonly purchaseService: PurchaseService) {}

    @Roles(UserRole.ADMIN, UserRole.USER)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post()
    async purchase(@Req() req: UserRequest, @Body() vinylId: number): Promise<Purchase> {
        logger.info('Create new purchase');
        return await this.purchaseService.create(+vinylId, +req.id);
    }

    @Post('webhook')
    async handleStripeWebhook(
        @Req() req: RawBodyRequest<Request>,
        @Headers('stripe-signature') signature: string
    ) {
        const raw = req.rawBody;
        return await this.purchaseService.webhook(raw, signature);
    }
}
