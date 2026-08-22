import nodemailer from 'nodemailer';
import { logger } from './logger.js';

// Create SMTP Transporter (configured for Gmail or custom SMTP)
const createTransporter = () => {
  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
};

/**
 * Sends a Welcome Email to the user's Gmail / Email address upon account registration
 */
export async function sendWelcomeEmail(toEmail: string, fullName: string, merchantId: string) {
  const transporter = createTransporter();

  const subject = `Welcome to RPAI - Your Financial Operations Account is Ready! 🚀`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
      <div style="background-color: #4f46e5; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">RPAI</h1>
        <p style="color: #c7d2fe; margin: 5px 0 0 0; font-size: 14px;">Razor Pay Artificial Intelligence</p>
      </div>
      
      <div style="padding: 24px; background-color: #ffffff;">
        <h2 style="color: #1e293b; margin-top: 0;">Welcome, ${fullName}! 👋</h2>
        <p style="color: #475569; line-height: 1.6;">
          Your RPAI Merchant Account has been successfully created and configured. You now have full access to our AI Financial Operations Center.
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 8px 0; color: #64748b; font-size: 12px; font-weight: bold; text-transform: uppercase;">ACCOUNT DETAILS</p>
          <p style="margin: 4px 0; color: #1e293b; font-size: 14px;"><strong>Email:</strong> ${toEmail}</p>
          <p style="margin: 4px 0; color: #1e293b; font-size: 14px;"><strong>Merchant ID:</strong> <code style="background: #e0e7ff; color: #3730a3; padding: 2px 6px; border-radius: 4px;">${merchantId}</code></p>
          <p style="margin: 4px 0; color: #1e293b; font-size: 14px;"><strong>Environment:</strong> Test Mode (Razorpay Live Enabled)</p>
        </div>

        <p style="color: #475569; line-height: 1.6;">
          What you can do next:
        </p>
        <ul style="color: #475569; padding-left: 20px; line-height: 1.8;">
          <li>Automate transactions with the <strong>Payment Agent</strong></li>
          <li>Monitor real-time risk scores with our <strong>Fraud Detection Engine</strong></li>
          <li>Evaluate applicant scores with <strong>Credit Intelligence</strong></li>
        </ul>

        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.FRONTEND_URL || 'https://rpai.netlify.app'}/login" 
             style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Launch RPAI Dashboard
          </a>
        </div>
      </div>

      <div style="background-color: #f1f5f9; padding: 16px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #64748b;">
        <p style="margin: 0;">© 2026 RPAI Platform — Built by Ritwik Mathur</p>
      </div>
    </div>
  `;

  if (!transporter) {
    logger.info(`[Email Service Sim] Welcome email queued for ${toEmail} (Merchant: ${merchantId})`);
    return false;
  }

  try {
    await transporter.sendMail({
      from: `"RPAI Platform" <${process.env.SMTP_USER || process.env.GMAIL_USER}>`,
      to: toEmail,
      subject,
      html: htmlContent,
    });
    logger.info(`[Email Service] Live Welcome email sent successfully to ${toEmail}`);
    return true;
  } catch (error: any) {
    logger.error(`[Email Service Error] Failed to send email to ${toEmail}: ${error.message}`);
    return false;
  }
}
