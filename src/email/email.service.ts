import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EmailNotificationParams } from '../interfaces/email-notification-params';
import { SendMailOptions, SentMessageInfo } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailNotificationService {
    constructor(private readonly configService: ConfigService) {}

    private transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: this.configService.get('GMAIL_LOGIN'),
            pass: this.configService.get('GMAIL_PASSWORD'),
        },
    });

    sendEmailNotification = (emailParams: EmailNotificationParams): void => {
        const mailOptions: SendMailOptions = {
            from: this.configService.get('GMAIL_LOGIN'),
            to: emailParams.userEmail,
            subject: emailParams.subject,
            text: emailParams.message,
        };

        this.transporter.sendMail(
            mailOptions,
            (error: Error | null, info: SentMessageInfo): void => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            }
        );
    };
}
