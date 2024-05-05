import { Test, TestingModule } from '@nestjs/testing';
import { VinylController } from './vinyl.controller';
import { VinylService } from './vinyl.service';
import { BotService } from '../bot/bot.service';
import { Repository } from 'typeorm';
import { Vinyl } from './entities/vinyl.entity';
import { CreateVinylDto } from './dto/create-vinyl.dto';
import { UpdateVinylDto } from './dto/update-vinyl.dto';
import { VinylResponse } from '../interfaces/vinyl-response';
import { FindVinylDto } from './dto/find-vinyl.dto';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { BcryptCryptographyService } from '../cryptography/bcrypt-cryptography.service';
import { CacheModule } from '@nestjs/cache-manager';

describe('VinylController', () => {
    let vinylController: VinylController;
    let vinylService: VinylService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [CacheModule.register()],
            controllers: [VinylController],
            providers: [
                VinylService,
                {
                    provide: getRepositoryToken(Vinyl),
                    useValue: {},
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: {},
                },
                UserService,
                ConfigService,
                BotService,
                BcryptCryptographyService,
            ],
        }).compile();

        vinylService = module.get<VinylService>(VinylService);
        vinylController = module.get<VinylController>(VinylController);
    });

    describe('remove', () => {
        it('should return an id', async () => {
            const result = 1;
            jest.spyOn(vinylService, 'remove').mockImplementation(async () => result);

            const id = 1
            expect(await vinylController.remove(1)).toBe(result);
        });
    });

    describe('create', () => {
        it('should return a vinyl', async () => {
            const result: Vinyl = {
                id: 1,
                name: 'test vinyl',
                description: 'test',
                authorName: 'test author',
                price: 10,
                image: 'test image',
                reviews: [],
                purchases: [],
            };

            jest.spyOn(vinylService, 'create').mockImplementation(async () => result);

            const testData: CreateVinylDto = {
                name: 'test vinyl',
                description: 'test',
                authorName: 'test author',
                price: 10,
                image: 'test image',
            };

            expect(await vinylController.create(testData)).toBe(result);
        });
    });

    describe('update', () => {
        it('should return a vinyl', async () => {
            const result: Vinyl = {
                id: 1,
                name: 'test vinyl',
                description: 'test',
                authorName: 'test author',
                price: 10,
                image: 'test image',
                reviews: [],
                purchases: [],
            };

            jest.spyOn(vinylService, 'update').mockImplementation(async () => result);

            const id = 1;
            const testData: UpdateVinylDto = {
                name: 'test vinyl',
                description: 'test',
                authorName: 'test author',
                price: 10,
                image: 'test image',
            };

            expect(await vinylController.update(id, testData)).toBe(result);
        });
    });

    describe('find', () => {
        it('should return a vinyl response', async () => {
            const result: VinylResponse = {
                vinyls: [
                    {
                        id: 1,
                        name: 'test vinyl',
                        description: 'test',
                        authorName: 'test author',
                        price: 10,
                        image: 'test image',
                        reviews: [],
                        purchases: [],
                    },
                ],
                pages: 1,
                take: 1,
                skip: 1,
            };

            jest.spyOn(vinylService, 'find').mockImplementation(async () => result);

            const testData: Pick<FindVinylDto, 'take' | 'skip'> = {
                take: 1,
                skip: 1,
            };

            expect(await vinylController.find(testData)).toBe(result);
        });
    });

    describe('findUniversal', () => {
        it('should return a vinyl response', async () => {
            const result: VinylResponse = {
                vinyls: [
                    {
                        id: 1,
                        name: 'test vinyl',
                        description: 'test',
                        authorName: 'test author',
                        price: 10,
                        image: 'test image',
                        reviews: [],
                        purchases: [],
                    },
                ],
                pages: 1,
                take: 1,
                skip: 1,
            };

            jest.spyOn(vinylService, 'findUniversal').mockImplementation(async () => result);

            const testData: FindVinylDto = {
                take: 1,
                skip: 1,
                sortOption: 'ASC',
                sortParam: 'price',
                filterString: 'test',
            };

            expect(await vinylController.findUniversal(testData)).toBe(result);
        });
    });
});
