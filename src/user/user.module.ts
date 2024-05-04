import { Global, Logger, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { GoogleStrategy } from '../strategies/google.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BcryptCryptographyService } from '../cryptography/bcrypt-cryptography.service';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UserController],
    providers: [UserService, GoogleStrategy, BcryptCryptographyService],
    exports: [UserService]
})
export class UserModule {}
