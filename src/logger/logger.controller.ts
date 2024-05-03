import { Controller, Get, UseGuards } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { Roles } from '../decorators/roles.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { UserRole } from '../types/user-role.enum';

@Controller('logger')
export class LoggerController {
    constructor(private readonly loggerService: LoggerService) {}

    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Get()
    async findAll(): Promise<string> {
        return await this.loggerService.findAllLogs();
    }
}
