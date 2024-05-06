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
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GuestFindVinylDto } from './dto/guest-find-vinyl.dto';

@ApiTags('Vinyl Controller')
@Controller('vinyl')
export class VinylController {
    constructor(private readonly vinylService: VinylService) {}

    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post()
    @ApiBearerAuth('Bearer Auth')
    @ApiOperation({
        summary: 'Create new vinyl',
        description:
            'This endpoint requires a valid JWT token. The role of the user is determined by the token.',
    })
    @ApiCreatedResponse({ description: 'Vinyl created' })
    @ApiUnauthorizedResponse({ description: 'Authentication required' })
    @ApiForbiddenResponse({ description: 'Invalid token' })
    async create(@Body() createVinylDto: CreateVinylDto): Promise<Vinyl> {
        const newVinyl = await this.vinylService.create(createVinylDto);
        logger.info(`Create new vinyl with id ${newVinyl.id}`);
        return newVinyl;
    }

    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Patch(':id')
    @ApiBearerAuth('Bearer Auth')
    @ApiOperation({
        summary: 'Update vinyl',
        description:
            'This endpoint requires a valid JWT token. The role of the user is determined by the token.',
    })
    @ApiOkResponse({ description: 'Vinyl was updated' })
    @ApiUnauthorizedResponse({ description: 'Authentication required' })
    @ApiForbiddenResponse({ description: 'Invalid token' })
    @ApiBadRequestResponse({ description: 'This vinyl does not exist' })
    async update(@Param('id') id: number, @Body() updateVinylDto: UpdateVinylDto): Promise<Vinyl> {
        const vinyl = await this.vinylService.update(+id, updateVinylDto);
        logger.info(`Update vinyl with id ${vinyl.id}`);
        return vinyl;
    }

    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Delete(':id')
    @ApiBearerAuth('Bearer Auth')
    @ApiOperation({
        summary: 'Delete vinyl',
        description:
            'This endpoint requires a valid JWT token. The role of the user is determined by the token.',
    })
    @ApiOkResponse({ description: 'Vinyl was deleted' })
    @ApiUnauthorizedResponse({ description: 'Authentication required' })
    @ApiForbiddenResponse({ description: 'Invalid token' })
    @ApiBadRequestResponse({ description: 'This vinyl does not exist' })
    async remove(@Param('id') id: number): Promise<number> {
        const deletedVinylId = await this.vinylService.remove(+id);
        logger.info(`Delete vinyl with id ${deletedVinylId}`);
        return deletedVinylId;
    }

    @Post('/guest-find')
    @ApiOperation({
        summary: 'Find vinyls',
    })
    @ApiCreatedResponse({ description: 'Vinyls was found' })
    async find(@Body() findVinylDto: GuestFindVinylDto): Promise<VinylResponse> {
        return await this.vinylService.find(findVinylDto);
    }

    @Roles(UserRole.ADMIN, UserRole.USER)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post('/find')
    @ApiBearerAuth('Bearer Auth')
    @ApiOperation({
        summary: 'Find vinyls with sort and filter',
        description:
            'This endpoint requires a valid JWT token. The role of the user is determined by the token.',
    })
    @ApiCreatedResponse({ description: 'Vinyls was found' })
    @ApiUnauthorizedResponse({ description: 'Authentication required' })
    @ApiForbiddenResponse({ description: 'Invalid token' })
    async findUniversal(@Body() findVinylDto: FindVinylDto): Promise<VinylResponse> {
        return this.vinylService.findUniversal(findVinylDto);
    }
}
