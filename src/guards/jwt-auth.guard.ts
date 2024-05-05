import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { DecodedToken } from '../interfaces/decoded-token';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly configService: ConfigService,
        private userService: UserService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) throw new UnauthorizedException('Authentication required');

        const userId = await this.cacheManager.get(token);
        if(!userId) throw new ForbiddenException('Invalid token');

        try {
            const decoded: DecodedToken = (await verify(
                token,
                this.configService.get('JWT_ACCESS_SECRET')
            )) as DecodedToken;

            const user = await this.userService.findById(+decoded?.sub);
            if (!user) throw new ForbiddenException('Invalid token');

            req.id = +decoded?.sub;
            req.role = decoded?.role;

            return true;
        } catch (err) {
            throw new ForbiddenException('Invalid token');
        }
    }
}
