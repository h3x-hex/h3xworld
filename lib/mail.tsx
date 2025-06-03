import * as nodemailer from 'nodemailer';
import { EmailTemplate } from '@/components/auth/forms/verify-email-template';
import { render } from '@react-email/components';
import SMTPTransport from 'nodemailer/lib/smtp-transport';


const domain = 'http://localhost:3000';

export const sendVerificationEmail = async (email: string, token: string) => {

    const confirmationLink = `${domain}/verify-email?token=${token}`;
    const fromEmail = 'noreply@h3x.world'

    try {

        const transporter = nodemailer.createTransport({
            host: "smtpout.secureserver.net",
            secure: true,
            secureConnection: false,
            tls: {
                ciphers: 'SSLv3'
            },
            requireTLS: true,
            port: 465,
            debug: true,
            auth: {
                user: fromEmail,
                pass: "Wedxzas1,"
            }
        } as SMTPTransport.Options)

        const emailHtml = await render(<EmailTemplate url={confirmationLink} />);

        const mailOptions = {
            from: fromEmail,
            to: email,
            subject: 'Welcome to h3x.world! Verify your email',
            html: emailHtml,
        }

        await transporter.sendMail(mailOptions);
        return {
            success: true,
            error: null,
        };
        
    } catch (error) {

        console.log(error)
        return {
            success: false,
        };

    }


}