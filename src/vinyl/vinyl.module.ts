import { Module } from '@nestjs/common';
import { VinylService } from './vinyl.service';
import { VinylController } from './vinyl.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vinyl } from './entities/vinyl.entity';
import { BotService } from '../bot/bot.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vinyl])],
  controllers: [VinylController],
  providers: [VinylService, BotService],
  exports: [VinylService]
})
export class VinylModule {}
