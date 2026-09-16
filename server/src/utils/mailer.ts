import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.SMTP_PORT || '2525', 10),
  auth: {
    user: process.env.SMTP_USER || 'testuser',
    pass: process.env.SMTP_PASS || 'testpass',
  },
});

export const sendWelcomeEmail = async (to: string, name: string) => {
  try {
    await transporter.sendMail({
      from: '"Fitora Gym" <welcome@fitora.app>',
      to,
      subject: 'Welcome to Fitora - Let\'s CRUSH your goals! 💪',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 30px; border-radius: 10px;">
          <h1 style="color: #fff; text-transform: uppercase; font-weight: 900; margin-bottom: 5px;">WELCOME TO FITORA, ${name.toUpperCase()}!</h1>
          <p style="color: #ccc; line-height: 1.6;">Your premium fitness journey starts now. We've set up your account and you're ready to start tracking workouts, logging meals, and crushing PRs.</p>
          <a href="https://fitora.app/dashboard" style="display: inline-block; background: #fff; color: #000; font-weight: bold; text-decoration: none; padding: 12px 25px; border-radius: 50px; margin-top: 20px;">GO TO DASHBOARD</a>
        </div>
      `,
    });
    console.log(`Welcome email sent to ${to}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};
