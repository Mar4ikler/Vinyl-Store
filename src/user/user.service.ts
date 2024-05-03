import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { BcryptCryptographyService } from '../cryptography/bcrypt-cryptography.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RequestWithAuthorization } from '../interfaces/request-with-authorization';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private readonly configService: ConfigService,
        private cryptographyService: BcryptCryptographyService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    async googleLogin(req): Promise<string> {
        const googleUser = req?.user;

        let user = await this.usersRepository.findOneBy({ email: googleUser.email });
        if (!user) {
            user = await this.usersRepository.save({
                ...googleUser,
                password: null,
            });
        }

        const token = sign(
            { sub: user.id, role: user.role },
            this.configService.get('JWT_ACCESS_SECRET'),
            {
                issuer: this.configService.get('JWT_ISSUER'),
                audience: this.configService.get('JWT_AUDIENCE'),
                expiresIn: this.configService.get('JWT_ACCESS_EXPIRES'),
            }
        );
        await this.cacheManager.set(token, user.id, this.configService.get('JWT_ACCESS_EXPIRES'));
        return token;
    }

    async register(createUserDto: CreateUserDto): Promise<User> {
        const user = await this.usersRepository.findOneBy({ email: createUserDto.email });
        if (user) throw new BadRequestException('User with this email already exists');
        const newUser = await this.usersRepository.save({
            ...createUserDto,
            password: await this.cryptographyService.encryptPassword(createUserDto.password),
        });
        return newUser;
    }

    async login(loginUserDto: LoginUserDto): Promise<string> {
        const user = await this.usersRepository.findOneBy({ email: loginUserDto.email });
        if (!user) throw new BadRequestException('Incorrent email or password');
        try {
            const isPasswordCorrect = await this.cryptographyService.comparePasswords(
                loginUserDto.password,
                user.password
            );
            if (!isPasswordCorrect) throw new BadRequestException('Incorrent email or password');
        } catch (e) {
            throw new BadRequestException('Incorrent email or password');
        }
        const token = sign(
            { sub: user.id, role: user.role },
            this.configService.get('JWT_ACCESS_SECRET'),
            {
                issuer: this.configService.get('JWT_ISSUER'),
                audience: this.configService.get('JWT_AUDIENCE'),
                expiresIn: this.configService.get('JWT_ACCESS_EXPIRES'),
            }
        );
        await this.cacheManager.set(token, user.id, +this.configService.get('JWT_ACCESS_EXPIRES'));
        return token;
    }

    findOne(id: number): Promise<User> {
        return this.usersRepository.findOne({
            where: { id },
            relations: {
                reviews: true,
                purchases: true
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                birthdate: true,
                avatar: true,
                email: true,
            },
        });
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        await this.usersRepository.update(id, updateUserDto);
        return this.usersRepository.findOne({
            where: { id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                birthdate: true,
                avatar: true,
                email: true,
            },
        });
    }

    async remove(id: number): Promise<number> {
        const deleteResult = await this.usersRepository.delete({ id });
        if (!deleteResult.affected) throw new BadRequestException('This user does not exist');
        return id;
    }

    async logout(req: RequestWithAuthorization) {
        const token = req.headers.authorization?.split(' ')[1];
        const value = await this.cacheManager.get(token);
        if (!value) throw new ForbiddenException('Invalid token');
        await this.cacheManager.del(token);
        return value;
    }

    findById(id: number): Promise<User> {
        return this.usersRepository.findOneBy({ id });
    }
}
