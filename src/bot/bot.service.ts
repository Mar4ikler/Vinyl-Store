import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class BotService {
    private bot: TelegramBot;
    private channelId: string;

    constructor(private configService: ConfigService) {
        const token = this.configService.get('TELEGRAM_BOT_TOKEN');
        this.channelId = this.configService.get('TELEGRAM_CHANNEL_ID');
        this.bot = new TelegramBot(token, { polling: true });
    }

    async sendMessageToChannel(message: string): Promise<void> {
        await this.bot.sendMessage(this.channelId, message);
    }
}
