import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Purchase } from './entities/purchase.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { VinylService } from '../vinyl/vinyl.service';
import { StripeService } from '../stripe/stripe.service';
import { EmailNotificationService } from '../email/email.service';
import Stripe from 'stripe';

@Injectable()
export class PurchaseService {
    constructor(
        @InjectRepository(Purchase)
        private purchasesRepository: Repository<Purchase>,
        private readonly userService: UserService,
        private readonly vinylService: VinylService,
        private readonly stripeService: StripeService,
        private readonly emailNotificationService: EmailNotificationService
    ) {}

    async create(vinylId: number, userId: number): Promise<Purchase> {
        const vinyl = await this.vinylService.findById(vinylId);
        if (!vinyl) throw new BadRequestException('This vinyl does not exists');
        const paymentId = await this.stripeService.processPayment(vinyl.price);
        const newPurchase = await this.purchasesRepository.save({
            vinylId,
            userId,
            paymentId,
            totalPrice: vinyl.price,
        });
        return newPurchase;
    }

    async webhook(rawBody: Buffer, signature: string) {
        let event: Stripe.Event;
        try {
            event = this.stripeService.stripe.webhooks.constructEvent(
                rawBody,
                signature,
                'we_1PCLDyKujS7tkPiVyh5yKhyH'
            );
        } catch (err) {
            return { statusCode: 400, body: 'Webhook Error: ' + err.message };
        }

        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log(`PaymentIntent was successful`);
                break;
            case 'payment_intent.payment_failed':
                const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log(`PaymentIntent failed`);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return { statusCode: 200 };
    }
}
