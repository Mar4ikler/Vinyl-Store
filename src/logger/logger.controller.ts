import { Controller, Get, UseGuards } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { Roles } from '../decorators/roles.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { UserRole } from '../types/user-role.enum';
import { ApiBearerAuth, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('Logger Controller')
@Controller('logger')
export class LoggerController {
    constructor(private readonly loggerService: LoggerService) {}

    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Get()
    @ApiBearerAuth('Bearer Auth')
    @ApiOperation({
        summary: 'Find logs',
        description:
            'This endpoint requires a valid JWT token. The role of the user is determined by the token.',
    })
    @ApiOkResponse({ description: 'Logs was found' })
    @ApiUnauthorizedResponse({ description: 'Authentication required' })
    @ApiForbiddenResponse({ description: 'Invalid token' })
    async findAll(): Promise<string> {
        return await this.loggerService.findAllLogs();
    }
}
