import { Transporter } from 'nodemailer';

export function createEmailTransporter(): Transporter | null;

export const emailTemplates: {
  [templateName: string]: {
    subject: string;
    html: string;
  };
};
