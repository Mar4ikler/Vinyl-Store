import { Module } from '@nestjs/common';
import { VinylService } from './vinyl.service';
import { VinylController } from './vinyl.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vinyl } from './entities/vinyl.entity';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { User } from '../user/entities/user.entity';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vinyl, User])],
  controllers: [VinylController],
  providers: [VinylService],
  exports: [VinylService]
})
export class VinylModule {}
