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
import { ConfigService } from '@nestjs/config';
import { PaymentStatus } from '../types/payment-status.enum';

@Injectable()
export class PurchaseService {
    constructor(
        @InjectRepository(Purchase)
        private purchasesRepository: Repository<Purchase>,
        private readonly userService: UserService,
        private readonly vinylService: VinylService,
        private readonly stripeService: StripeService,
        private readonly emailNotificationService: EmailNotificationService,
        private readonly configService: ConfigService
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
                this.configService.get('STRIPE_WEBHOOK_SECRET')
            );
        } catch (err) {
            return { statusCode: 400, body: 'Webhook Error: ' + err.message };
        }

        const payment = event.data.object as Stripe.PaymentIntent;
        //const purchase = this.purchasesRepository.findOneBy({ paymentId: payment.id });

        switch (event.type) {
            case 'payment_intent.succeeded':
                await this.purchasesRepository.update(
                    { paymentId: payment.id },
                    { paymentDate: new Date(), status: PaymentStatus.SUCCEEDED }
                );
                console.log(`PaymentIntent was successful`);
                break;
            case 'payment_intent.payment_failed':
                await this.purchasesRepository.update(
                    { paymentId: payment.id },
                    { paymentDate: new Date(), status: PaymentStatus.FAILED }
                );
                console.log(`PaymentIntent failed`);
                break;
            case 'payment_intent.processing':
                await this.purchasesRepository.update(
                    { paymentId: payment.id },
                    { status: PaymentStatus.PROCESSING }
                );
                console.log(`PaymentIntent failed`);
                break;
            case 'payment_intent.created':
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return { statusCode: 200 };
    }
}
