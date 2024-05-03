import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
} from '@nestjs/common';
import { VinylService } from './vinyl.service';
import { CreateVinylDto } from './dto/create-vinyl.dto';
import { UpdateVinylDto } from './dto/update-vinyl.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../types/user-role.enum';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { Vinyl } from './entities/vinyl.entity';
import { VinylResponse } from '../interfaces/vinyl-response';
import { FindVinylDto } from './dto/find-vinyl.dto';
import { logger } from '../logger/logger.config';

@Controller('vinyl')
export class VinylController {
    constructor(private readonly vinylService: VinylService) {}

    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post()
    async create(@Body() createVinylDto: CreateVinylDto): Promise<Vinyl> {
        logger.info('Create new vinyl');
        return await this.vinylService.create(createVinylDto);
    }

    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Patch(':id')
    async update(@Param('id') id: number, @Body() updateVinylDto: UpdateVinylDto): Promise<Vinyl> {
        logger.info('Update vinyl');
        return await this.vinylService.update(+id, updateVinylDto);
    }

    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<number> {
        logger.info('Delete vinyl');
        return await this.vinylService.remove(+id);
    }

    @Get()
    async find(@Body() findVinylDto: Pick<FindVinylDto, 'take' | 'skip'>): Promise<VinylResponse> {
        return await this.vinylService.find(+findVinylDto.take, +findVinylDto.skip);
    }

    //TODO reviews score
    @Roles(UserRole.ADMIN, UserRole.USER)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Get('/search')
    async findUniversal(@Body() findVinylDto: FindVinylDto): Promise<VinylResponse> {
        return this.vinylService.findUniversal(findVinylDto);
    }
}
