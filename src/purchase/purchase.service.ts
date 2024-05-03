import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Purchase } from './entities/purchase.entity';
import { Repository } from 'typeorm';
import { VinylService } from '../vinyl/vinyl.service';
import { StripeService } from '../stripe/stripe.service';
import { EmailNotificationService } from '../email/email.service';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { PaymentStatus } from '../types/payment-status.enum';
import { EmailNotificationParams } from '../interfaces/email-notification-params';

@Injectable()
export class PurchaseService {
    constructor(
        @InjectRepository(Purchase)
        private purchasesRepository: Repository<Purchase>,
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

        const purchase = await this.purchasesRepository.findOne({
            where: { paymentId: payment.id },
            relations: {
                user: true,
            },
        });

        const userEmail = purchase.user.email;
        let emailParams: EmailNotificationParams;

        switch (event.type) {
            case 'payment_intent.succeeded':
                await this.purchasesRepository.update(
                    { paymentId: payment.id },
                    { paymentDate: new Date(), status: PaymentStatus.SUCCEEDED }
                );
                emailParams = {
                    userEmail: userEmail,
                    subject: 'Payment status updated',
                    message: `Status of your payment with id ${payment.id} now is succeeded`,
                };
                this.emailNotificationService.sendEmailNotification(emailParams);
                console.log(`PaymentIntent was successful`);
                break;
            case 'payment_intent.payment_failed':
                await this.purchasesRepository.update(
                    { paymentId: payment.id },
                    { paymentDate: new Date(), status: PaymentStatus.FAILED }
                );
                emailParams = {
                    userEmail: userEmail,
                    subject: 'Payment status updated',
                    message: `Status of your payment with id ${payment.id} now is failed`,
                };
                this.emailNotificationService.sendEmailNotification(emailParams);
                console.log(`PaymentIntent failed`);
                break;
            case 'payment_intent.processing':
                await this.purchasesRepository.update(
                    { paymentId: payment.id },
                    { status: PaymentStatus.PROCESSING }
                );
                emailParams = {
                    userEmail: userEmail,
                    subject: 'Payment status updated',
                    message: `Status of your payment with id ${payment.id} now is processing`,
                };
                this.emailNotificationService.sendEmailNotification(emailParams);
                console.log(`PaymentIntent failed`);
                break;
            case 'payment_intent.created':
                emailParams = {
                    userEmail: userEmail,
                    subject: 'Payment status updated',
                    message: `Status of your payment with id ${payment.id} now is created`,
                };
                this.emailNotificationService.sendEmailNotification(emailParams);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return { statusCode: 200 };
    }
}
