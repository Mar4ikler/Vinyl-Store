import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { VinylModule } from './vinyl/vinyl.module';
import { ReviewModule } from './review/review.module';
import { PurchaseModule } from './purchase/purchase.module';
import { LoggerModule } from './logger/logger.module';


@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DATABASE_HOST'),
                port: +configService.get('DATABASE_PORT'),
                username: configService.get('DATABASE_USERNAME'),
                password: configService.get('DATABASE_PASSWORD'),
                database: configService.get('DATABASE_NAME'),
                entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
                synchronize: false,
                migrations: [__dirname + '/migrations/*{.ts,.js}'],
            }),
            inject: [ConfigService],
        }),
        CacheModule.register({
            isGlobal: true,
        }),
        UserModule,
        VinylModule,
        ReviewModule,
        PurchaseModule,
        LoggerModule,
    ],
})
export class AppModule {}
