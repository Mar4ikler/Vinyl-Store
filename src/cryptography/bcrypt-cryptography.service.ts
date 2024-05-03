import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptCryptographyService {
    comparePasswords(password: string, passwordHash: string): Promise<boolean> {
        return bcrypt.compare(password, passwordHash);
    }

    encryptPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }
}
