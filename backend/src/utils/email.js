const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "StreamVault - Password Reset OTP",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;background:#060610;color:#fff;border-radius:12px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#ff2d55,#5856d6);padding:32px;text-align:center">
          <h1 style="margin:0;font-size:28px">▶ StreamVault</h1>
          <p style="margin:8px 0 0;opacity:.8">Password Reset</p>
        </div>
        <div style="padding:32px">
          <h2 style="margin:0 0 16px">Your OTP Code</h2>
          <p style="color:#8888a8;margin:0 0 24px">Use this code to reset your password. It expires in 10 minutes.</p>
          <div style="background:#171735;border-radius:8px;padding:24px;text-align:center;margin-bottom:24px">
            <div style="font-size:40px;font-weight:800;letter-spacing:16px;color:#ff2d55">${otp}</div>
          </div>
          <p style="color:#8888a8;font-size:13px">If you didn't request this, ignore this email. Your password won't change.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };
