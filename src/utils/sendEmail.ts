import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (
  email: string,
  otp: string
) => {
  await transporter.sendMail({
    from: `"TicketHub" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your TicketHub account",

    html: `
      <div style="font-family:Arial;padding:30px">

        <h2>Welcome to TicketHub 🎟️</h2>

        <p>Your verification code is</p>

        <h1 style="letter-spacing:8px">
          ${otp}
        </h1>

        <p>This OTP expires in 10 minutes.</p>

      </div>
    `,
  });
};