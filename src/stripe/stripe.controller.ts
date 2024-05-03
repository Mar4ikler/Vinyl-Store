import { Body, Controller, Get, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
    constructor(private stripeService: StripeService) {}

    @Post('purchase')
    async purchaseVinyl(@Body() amount: number) {
        return await this.stripeService.processPayment(12);
    }
}
