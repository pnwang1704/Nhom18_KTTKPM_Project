const nodemailer = require('nodemailer');

// Cấu hình Email Transporter
// Nếu có thông tin thực tế, bạn hãy điền vào đây. 
// Hiện tại mình dùng dịch vụ test hoặc in ra console nếu lỗi.
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.ethereal.email',
  port: process.env.MAIL_PORT || 587,
  auth: {
    user: process.env.MAIL_USER || '', // Tên đăng nhập email
    pass: process.env.MAIL_PASS || ''  // Mật khẩu email
  }
});

const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: '"ELPPA Store" <noreply@elppa.com>',
      to: email,
      subject: 'Mã xác thực OTP đặt lại mật khẩu - ELPPA',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; rounded: 12px;">
          <h2 style="color: #0066CC; text-align: center;">ELPPA Store</h2>
          <p>Chào bạn,</p>
          <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng sử dụng mã OTP dưới đây để xác thực:</p>
          <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #1d1d1f; border-radius: 8px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #ef4444; font-size: 14px;">Mã OTP này sẽ hết hạn sau 10 phút. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="font-size: 12px; color: #86868b; text-align: center;">© 2024 ELPPA Store. Bảo lưu mọi quyền.</p>
        </div>
      `
    };

    // In ra console để dev dễ kiểm tra nếu chưa cấu hình SMTP
    console.log(`[MAIL] Sending OTP ${otp} to ${email}`);
    
    // Nếu đã có thông tin USER/PASS thì mới thực hiện gửi thật
    if (process.env.MAIL_USER && process.env.MAIL_PASS) {
      await transporter.sendMail(mailOptions);
    }
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = {
  sendOTPEmail
};
