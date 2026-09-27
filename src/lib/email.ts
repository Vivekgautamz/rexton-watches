import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.hostinger.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465');
const SMTP_SECURE = process.env.SMTP_SECURE === 'true' || SMTP_PORT === 465;
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'REXTON Concierge <concierge@rexton.com>';

export const mailTransporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

export async function sendOrderConfirmationEmail({
  to,
  customerName,
  orderNumber,
  orderDate,
  items,
  totalAmount,
  shippingAddress,
}: {
  to: string;
  customerName: string;
  orderNumber: string;
  orderDate: string;
  items: Array<{ title: string; sku: string; quantity: number; price: string | number }>;
  totalAmount: string;
  shippingAddress: any;
}) {
  if (!SMTP_USER || !SMTP_PASSWORD) {
    console.log(`[EMAIL NOTICE] SMTP credentials not configured. Skipping live email dispatch for order ${orderNumber}`);
    return { success: true, mocked: true };
  }

  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #EAEAEA; font-size: 14px; color: #111;">
        <strong>${item.title}</strong><br/>
        <span style="font-size: 12px; color: #666;">SKU: ${item.sku} &bull; Qty: ${item.quantity}</span>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #EAEAEA; font-size: 14px; text-align: right; color: #111;">
        ${item.price}
      </td>
    </tr>
  `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>REXTON Order Confirmation - ${orderNumber}</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F8F8F7; margin: 0; padding: 40px 10px;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center">
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1px solid #E5E5E5; padding: 40px;">
              <!-- Header -->
              <tr>
                <td align="center" style="padding-bottom: 30px; border-bottom: 1px solid #111111;">
                  <h1 style="margin: 0; font-size: 28px; letter-spacing: 4px; font-weight: 400; color: #111111;">R E X T O N</h1>
                  <p style="margin: 5px 0 0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #C5A880;">Swiss Timeless Root</p>
                </td>
              </tr>
              <!-- Greetings -->
              <tr>
                <td style="padding: 30px 0 20px;">
                  <h2 style="font-size: 18px; font-weight: 500; color: #111111; margin: 0 0 10px;">Thank you for your acquisition, ${customerName}.</h2>
                  <p style="font-size: 14px; line-height: 22px; color: #555555; margin: 0;">
                    Your order <strong>${orderNumber}</strong> has been secured and confirmed. Our master watchmakers and concierge are preparing your timepiece in our dedicated temperature-controlled atelier.
                  </p>
                </td>
              </tr>
              <!-- Items -->
              <tr>
                <td>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                      <tr>
                        <th align="left" style="padding-bottom: 10px; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; color: #888;">Timepiece</th>
                        <th align="right" style="padding-bottom: 10px; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; color: #888;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHtml}
                    </tbody>
                  </table>
                </td>
              </tr>
              <!-- Total -->
              <tr>
                <td style="padding: 20px 0; border-bottom: 1px solid #EAEAEA;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="font-size: 14px; font-weight: 600; color: #111;">Total Amount Secured</td>
                      <td style="font-size: 18px; font-weight: 600; text-align: right; color: #111;">${totalAmount}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Shipping Address -->
              <tr>
                <td style="padding: 20px 0 30px;">
                  <h3 style="font-size: 12px; letter-spacing: 1px; text-transform: uppercase; color: #888; margin: 0 0 10px;">Insured Delivery Address</h3>
                  <p style="font-size: 13px; line-height: 20px; color: #333; margin: 0;">
                    ${shippingAddress.fullName}<br/>
                    ${shippingAddress.street}${shippingAddress.landmark ? `, ${shippingAddress.landmark}` : ''}<br/>
                    ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.postalCode}<br/>
                    ${shippingAddress.country}<br/>
                    Contact: ${shippingAddress.phone}
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td align="center" style="padding-top: 30px; border-top: 1px solid #EAEAEA; font-size: 11px; color: #888; line-height: 18px;">
                  <p style="margin: 0 0 5px;">REXTON WATCHES &bull; Concierge Care</p>
                  <p style="margin: 0;">All Rexton timepieces are accompanied by a 5-Year International Movement Warranty.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const info = await mailTransporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject: `Order Confirmation: ${orderNumber} - REXTON WATCHES`,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Failed to send order confirmation email:', error);
    return { success: false, error: error.message };
  }
}
