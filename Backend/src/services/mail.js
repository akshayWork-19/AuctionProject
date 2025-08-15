import sgMail from '@sendgrid/mail';
import { SENDGRID_API_KEY, EMAIL_FROM } from '../config.js';
import fs from 'fs';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
} else {
  console.warn('SENDGRID_API_KEY not set. Emails will be logged to console.');
}

export async function sendEmail({ to, subject, html, attachments = [] }) {
  if (!SENDGRID_API_KEY) {
    console.log('[DEV EMAIL]', { to, subject, html, attachments: attachments.map(a => a.filename) });
    return { mocked: true };
  }
  const msg = { to, from: EMAIL_FROM, subject, html };
  if (attachments.length) {
    // transform to base64
    msg.attachments = attachments.map(a => ({
      content: a.content ?? fs.readFileSync(a.path).toString('base64'),
      filename: a.filename,
      type: a.type || 'application/pdf',
      disposition: 'attachment'
    }));
  }
  return sgMail.send(msg);
}
