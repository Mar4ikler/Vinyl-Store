import { DynamicModule, Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Purchase } from './entities/purchase.entity';
import { UserModule } from '../user/user.module';
import { VinylModule } from '../vinyl/vinyl.module';
import { StripeModule } from '../stripe/stripe.module';
import { EmailNotificationService } from '../email/email.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Purchase, User]),
        UserModule,
        VinylModule,
        StripeModule.forRootAsync(),
    ],
    controllers: [PurchaseController],
    providers: [PurchaseService, EmailNotificationService],
})
export class PurchaseModule {}
