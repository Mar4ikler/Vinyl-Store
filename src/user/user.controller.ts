import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GoogleAuthGuard } from '../guards/google-auth.guard';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiExcludeEndpoint,
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { UserRequest } from '../interfaces/user-request';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../types/user-role.enum';
import { RoleGuard } from '../guards/role.guard';
import { RequestWithAuthorization } from '../interfaces/request-with-authorization';
import { logger } from '../logger/logger.config';

@ApiTags('User Controller')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @UseGuards(GoogleAuthGuard)
    @ApiExcludeEndpoint()
    async googleAuth(@Req() req) {}

    @Get('redirect')
    @UseGuards(GoogleAuthGuard)
    @ApiExcludeEndpoint()
    async googleAuthRedirect(@Req() req): Promise<string> {
        return await this.userService.googleLogin(req);
    }

    @Roles(UserRole.ADMIN, UserRole.USER)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Get('profile')
    @ApiOperation({
        summary: 'Get profile',
        description:
            'This endpoint requires a valid JWT token. The role of the user is determined by the token.',
    })
    @ApiBearerAuth('Bearer Auth')
    @ApiOkResponse({ description: 'Profile was found' })
    @ApiUnauthorizedResponse({ description: 'Authentication required' })
    @ApiForbiddenResponse({ description: 'Invalid token' })
    async findOne(@Req() req: UserRequest): Promise<User> {
        return await this.userService.findOne(req.id);
    }

    @Post('register')
    @ApiOperation({
        summary: 'Register new user',
    })
    @ApiCreatedResponse({ description: 'Register success' })
    @ApiBadRequestResponse({ description: 'User with this email already exists' })
    async register(@Body() createUserDto: CreateUserDto): Promise<User> {
        const newUser = await this.userService.register(createUserDto);
        logger.info(`Register new user with id ${newUser.id}`);
        return newUser;
    }

    @Post('login')
    @ApiOperation({
        summary: 'Login user',
    })
    @ApiCreatedResponse({ description: 'Login success' })
    @ApiBadRequestResponse({ description: 'Incorrent email or password' })
    async login(@Body() loginUserDto: LoginUserDto): Promise<string> {
        return await this.userService.login(loginUserDto);
    }

    @Roles(UserRole.ADMIN, UserRole.USER)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Patch()
    @ApiOperation({
        summary: 'Update profile',
        description:
            'This endpoint requires a valid JWT token. The role of the user is determined by the token.',
    })
    @ApiBearerAuth('Bearer Auth')
    @ApiOkResponse({ description: 'Profile was updated' })
    @ApiUnauthorizedResponse({ description: 'Authentication required' })
    @ApiForbiddenResponse({ description: 'Invalid token' })
    async update(@Req() req: UserRequest, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.userService.update(req.id, updateUserDto);
        logger.info(`Update user with id ${user.id}`);
        return user;
    }

    @Roles(UserRole.ADMIN, UserRole.USER)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Delete()
    @ApiOperation({
        summary: 'Delete user',
        description:
            'This endpoint requires a valid JWT token. The role of the user is determined by the token.',
    })
    @ApiBearerAuth('Bearer Auth')
    @ApiOkResponse({ description: 'Profile was deleted' })
    @ApiUnauthorizedResponse({ description: 'Authentication required' })
    @ApiForbiddenResponse({ description: 'Invalid token' })
    @ApiBadRequestResponse({ description: 'This user does not exist' })
    async remove(@Req() req: UserRequest): Promise<number> {
        const id = await this.userService.remove(req.id);
        logger.info(`Delete user with id ${id}`);
        return id;
    }

    @Roles(UserRole.ADMIN, UserRole.USER)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post('logout')
    @ApiOperation({
        summary: 'Logout user',
        description:
            'This endpoint requires a valid JWT token. The role of the user is determined by the token.',
    })
    @ApiBearerAuth('Bearer Auth')
    @ApiCreatedResponse({ description: 'Logout success' })
    @ApiForbiddenResponse({ description: 'Invalid token' })
    async logout(@Req() req: RequestWithAuthorization) {
        return await this.userService.logout(req);
    }
}
