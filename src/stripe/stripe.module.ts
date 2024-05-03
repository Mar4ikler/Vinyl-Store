import { DynamicModule, Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ConfigService } from '@nestjs/config';

@Module({})
export class StripeModule {
    static forRootAsync(): DynamicModule {
        return {
            module: StripeModule,
            providers: [
                StripeService,
                {
                    provide: 'STRIPE_API_KEY',
                    useFactory: async (configService: ConfigService) =>
                        configService.get('STRIPE_API_KEY'),
                    inject: [ConfigService],
                },
            ],
            exports: [StripeService],
        };
    }
}
