import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    public stripe: Stripe;

    constructor(@Inject('STRIPE_API_KEY') private readonly apiKey: string) {
        this.stripe = new Stripe(this.apiKey, {
            apiVersion: '2024-04-10',
        });
    }

    async processPayment(amount: number) {
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'usd',
            payment_method: 'pm_card_visa',
            confirm: true,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never',
            },
        });

        return paymentIntent.id;
    }
}
