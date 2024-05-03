import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../types/user-role.enum';

export const Roles = (...args: UserRole[]) => SetMetadata('roles', args);