import { Test, TestingModule } from '@nestjs/testing';
import { VinylService } from './vinyl.service';
import { CacheModule } from '@nestjs/cache-manager';
import { VinylController } from './vinyl.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Vinyl } from './entities/vinyl.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { BotService } from '../bot/bot.service';
import { BcryptCryptographyService } from '../cryptography/bcrypt-cryptography.service';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { CreateVinylDto } from './dto/create-vinyl.dto';
import { UpdateVinylDto } from './dto/update-vinyl.dto';
import { VinylResponse } from '../interfaces/vinyl-response';
import { FindVinylDto } from './dto/find-vinyl.dto';

describe('VinylService', () => {
    let vinylService: VinylService;
    let vinylsRepository: Repository<Vinyl>;
    let botService: BotService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [CacheModule.register()],
            controllers: [VinylController],
            providers: [
                VinylService,
                {
                    provide: getRepositoryToken(Vinyl),
                    useValue: {
                        save: jest.fn(),
                        update: jest.fn(),
                        findOne: jest.fn(),
                        find: jest.fn(),
                        count: jest.fn(),
                        delete: jest.fn(),
                    },
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
        vinylsRepository = module.get(getRepositoryToken(Vinyl));
        botService = module.get<BotService>(BotService);
    });

    describe('remove', () => {
        it('should return an id', async () => {
            const result: DeleteResult = {
                raw: 'test',
                affected: 1,
            };
            jest.spyOn(vinylsRepository, 'delete').mockImplementation(async () => result);

            const id = 1;
            expect(await vinylService.remove(id)).toBe(id);
        });

        it('should throw BadRequestException when vinyl is not found', async () => {
            const result: DeleteResult = {
                raw: 'test',
                affected: 0,
            };
            jest.spyOn(vinylsRepository, 'delete').mockImplementation(async () => result);

            const id = 1;
            await expect(vinylService.remove(id)).rejects.toThrow(BadRequestException);
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
            jest.spyOn(vinylsRepository, 'save').mockImplementation(async () => result);

            jest.spyOn(botService, 'sendMessageToChannel').mockImplementation();

            const testData: CreateVinylDto = {
                name: 'test vinyl',
                description: 'test',
                authorName: 'test author',
                price: 10,
                image: 'test image',
            };
            expect(await vinylService.create(testData)).toBe(result);
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
            const updateResult: UpdateResult = {
                raw: 'test',
                generatedMaps: [],
            };
            jest.spyOn(vinylsRepository, 'update').mockImplementation(async () => updateResult);
            jest.spyOn(vinylsRepository, 'findOne').mockImplementation(async () => result);

            const id = 1;
            const testData: UpdateVinylDto = {
                name: 'test vinyl',
                description: 'test',
                authorName: 'test author',
                price: 10,
                image: 'test image',
            };
            expect(await vinylService.update(id, testData)).toBe(result);
        });
    });

    describe('find', () => {
        it('should return a vinyl response', async () => {
            const findResult: Vinyl[] = [
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
            ];
            const countResult = 10;
            jest.spyOn(vinylsRepository, 'find').mockImplementation(async () => findResult);
            jest.spyOn(vinylsRepository, 'count').mockImplementation(async () => countResult);

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
                pages: 2,
                take: 5,
                skip: 0,
            };
            const skip = 0;
            const take = 5;
            expect(await vinylService.find(take, skip)).toStrictEqual(result);
        });
    });

    describe('findUniversal', () => {
        it('should return a vinyl response', async () => {
            const findResult: Vinyl[] = [
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
            ];
            const countResult = 10;
            jest.spyOn(vinylsRepository, 'find').mockImplementation(async () => findResult);
            jest.spyOn(vinylsRepository, 'count').mockImplementation(async () => countResult);

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
                pages: 2,
                take: 5,
                skip: 0,
            };
            const testData: FindVinylDto = {
                take: 5,
                skip: 0,
                sortOption: 'ASC',
                sortParam: 'price',
                filterString: 'test',
            };
            expect(await vinylService.findUniversal(testData)).toStrictEqual(result);
        });

        it('should return a vinyl response', async () => {
          const findResult: Vinyl[] = [
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
          ];
          const countResult = 10;
          jest.spyOn(vinylsRepository, 'find').mockImplementation(async () => findResult);
          jest.spyOn(vinylsRepository, 'count').mockImplementation(async () => countResult);

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
              pages: 2,
              take: 5,
              skip: 0,
          };
          const testData: FindVinylDto = {
              take: 5,
              skip: 0,
              sortOption: 'ASC',
              sortParam: 'price',
              filterString: 'test',
          };
          expect(await vinylService.findUniversal(testData)).toStrictEqual(result);
      });
    });
});
