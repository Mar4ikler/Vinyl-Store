import { Module } from '@nestjs/common';
import { LoggerController } from './logger.controller';
import { LoggerService } from './logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [LoggerController],
    providers: [LoggerService],
})
export class LoggerModule {}
