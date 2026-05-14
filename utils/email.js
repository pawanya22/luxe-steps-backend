const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send email
exports.sendEmail = async (options) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `${options.fromName || 'Luxe Steps'} <${process.env.EMAIL_FROM}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
    return info;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
};

// Welcome email template
exports.sendWelcomeEmail = async (email, name) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #000000 0%, #333333 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f9f9f9; }
        .button { display: inline-block; padding: 12px 30px; background: #000; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Luxe Steps!</h1>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          <p>Thank you for joining Luxe Steps - your destination for premium footwear.</p>
          <p>We're excited to have you as part of our community. Explore our exclusive collections and discover the perfect shoes for every occasion.</p>
          <a href="${process.env.FRONTEND_URL}/shop" class="button">Start Shopping</a>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Best regards,<br>The Luxe Steps Team</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await this.sendEmail({
    to: email,
    subject: 'Welcome to Luxe Steps!',
    html
  });
};

// Order confirmation email
exports.sendOrderConfirmationEmail = async (email, order) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #000000 0%, #333333 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f9f9f9; }
        .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .item { border-bottom: 1px solid #eee; padding: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmed!</h1>
        </div>
        <div class="content">
          <h2>Thank you for your order!</h2>
          <p>Your order #${order.orderNumber} has been confirmed and is being processed.</p>
          <div class="order-details">
            <h3>Order Summary</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Total:</strong> $${order.totalAmount.toFixed(2)}</p>
            <p><strong>Status:</strong> ${order.orderStatus}</p>
          </div>
          <p>You'll receive another email when your order ships.</p>
          <p>Best regards,<br>The Luxe Steps Team</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await this.sendEmail({
    to: email,
    subject: `Order Confirmation - ${order.orderNumber}`,
    html
  });
};
