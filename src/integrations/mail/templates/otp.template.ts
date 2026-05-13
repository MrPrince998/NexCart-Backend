export const otpTemplate = (name: string, otp: string) => `
  <div style="font-family: Arial; padding: 20px;">
    <h2>Hello ${name},</h2>
    <p>Your OTP code is:</p>
    <h1 style="color: #2c3e50;">${otp}</h1>
    <p>This code expires in 10 minutes.</p>
  </div>
`;
