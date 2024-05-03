import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerService {
    async findAllLogs(): Promise<string> {
        const logFilePath = path.resolve(__dirname, '../../archive.log');
        const logData = fs.readFileSync(logFilePath, 'utf8');
        return logData;
    }
}
