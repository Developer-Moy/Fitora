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
export const sendConsultationEmail = async (data: any) => {
  try {
    const to = "developermoy@gmail.com";
    await transporter.sendMail({
      from: '"Fitora Gym" <noreply@fitora.app>',
      to,
      subject: `New Consultation Inquiry from ${data.fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; color: #333; padding: 20px; border: 1px solid #ddd;">
          <h2 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 10px;">New Consultation Request</h2>
          <p><strong>Name:</strong> ${data.fullName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
          <p><strong>Class:</strong> ${data.selectedClass}</p>
          <p><strong>Branch:</strong> ${data.preferredBranch}</p>
          <p><strong>Program:</strong> ${data.preferredProgram}</p>
          <p><strong>Comment:</strong></p>
          <blockquote style="background: #e9e9e9; padding: 10px; border-left: 4px solid #ccc; margin: 10px 0;">
            ${data.comment || 'No comment provided.'}
          </blockquote>
        </div>
      `,
    });
    console.log(`Consultation email sent to ${to}`);
  } catch (error) {
    console.error('Error sending consultation email:', error);
  }
};

export const sendTrainerSessionEmail = async (trainerEmail: string, data: any) => {
  try {
    const to = trainerEmail || "developermoy@gmail.com";
    await transporter.sendMail({
      from: '"Fitora Gym" <noreply@fitora.app>',
      to,
      subject: `New Session Booking from ${data.fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; color: #333; padding: 20px; border: 1px solid #ddd;">
          <h2 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 10px;">New Session Booking Request</h2>
          <p><strong>Name:</strong> ${data.fullName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
          <p><strong>Date:</strong> ${new Date(data.date).toDateString()}</p>
          <p><strong>Time Slot:</strong> ${data.timeSlot}</p>
          <p style="margin-top: 20px;">Please login to your trainer dashboard to confirm this booking.</p>
        </div>
      `,
    });
    console.log(`Session booking email sent to ${to}`);
  } catch (error) {
    console.error('Error sending session booking email:', error);
  }
};
